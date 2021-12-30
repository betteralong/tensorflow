<template>
    <div>
        <div>
            <button v-for="(item,index) in labelList" 
                :key="item.label"
                :disabled="item.disabled"
                @click="onCollect(index)"
            >
                {{item.label}}
            </button>
        </div>
        <button @click="onSave">保存</button>
        <pre >{{count}}</pre>
        <button @click="onTrain">训练</button>
        <br><br>
        监听开关：<input type="checkbox" v-model="checked" @change="onChange" />
    </div>
</template>

<script>
import * as speechCommands from '@tensorflow-models/speech-commands';
import * as tfvis from '@tensorflow/tfjs-vis';
import { ref, onMounted, nextTick } from "vue"
export default {
    setup() {
        const MODEL_PATH = 'http://127.0.0.1:3000';
         let hasTrained = false
        let transferRecognizer;
        const count = ref(0)
        const checked = ref(false);
        const labelList = ref([
            {
                label: '播放',
                disabled: false
            },
            {
                label: '暂停',
                disabled: false
            },
            {
                label: '切歌',
                disabled: false
            }
        ])

        const onCollect = async (index) => {
            labelList.value[index].disabled = true;
            
            const label = labelList.value[index].label;
            await transferRecognizer.collectExample(
                label
            );
            count.value = transferRecognizer.countExamples();

            labelList.value[index].disabled = false;
        }

        const onChange = async() => {
            if (!hasTrained) return
            if (checked.value) {
                await transferRecognizer.listen(result => {
                    const { scores } = result;
                    const labels = transferRecognizer.wordLabels();
                    const index = scores.indexOf(Math.max(...scores));
                    console.log(labels[index]);
                }, {
                    overlapFactor: 0,
                    probabilityThreshold: 0.75
                });
            } else {
                transferRecognizer.stopListening();
            }
        }

        const onTrain = async () => {
            await transferRecognizer.train({
                epochs: 30,
                callback: tfvis.show.fitCallbacks(
                    { name: '训练效果' },
                    ['loss', 'acc'],
                    { callbacks: ['onEpochEnd'] }
                )
            });
            hasTrained = true
        }

        const onSave = () => {
            const arrayBuffer = transferRecognizer.serializeExamples();
            const blob = new Blob([arrayBuffer]);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'data.bin';
            link.click();
        }

        onMounted(async() => {
            const recognizer = speechCommands.create(
                'BROWSER_FFT',
                null,
                MODEL_PATH + '/speech/model.json',
                MODEL_PATH + '/speech/metadata.json'
            );
            await recognizer.ensureModelLoaded();
            transferRecognizer = recognizer.createTransfer('声音数据收集');
        })


        return {
            count,
            checked,
            labelList,

            onSave,
            onTrain,
            onCollect,
            onChange
        }
    }
}
</script>