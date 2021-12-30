<template>
    <div>
        <p>智能KTV</p>
        监听开关：<input type="checkbox" v-model="checked" @change="onCheck" />
        <video ref="videoRef" controls="" :src="music"></video>
        <p>当前指令：{{label}}</p>
    </div>
</template>

<script>
import * as speechCommands from '@tensorflow-models/speech-commands';
import { ref, onMounted, nextTick } from "vue"
export default {
    setup() {
        const checked = ref(false)
        const videoRef = ref()
        const label = ref('无');
        let transferRecognizer;
        const MODEL_PATH = 'http://127.0.0.1:3000';


        let index = 0;
        const musicList = [
            'https://gd-filems.dancf.com/saas/xi19e5/0/3d313fd5-1f4a-4612-9349-5e98e22bbae17909.mp3',
            'https://gd-filems.dancf.com/saas/xi19e5/0/b0ca8d0a-64cb-4574-804d-7aa6b0ec25717870.mp3',
            'https://gd-filems.dancf.com/saas/xi19e5/0/054d98f8-ea7b-42e8-8d87-08f35f802ff97923.mp3'
        ]
        const music = ref(musicList[index]);


        const nextMusic = () => {
            if (index < musicList.length - 1) {
                index++;
            } else {
                index = 0;
            }
            music.value = musicList[index];
            nextTick(() => {
                videoRef.value.play();
            })
        }

        const pause = () => {
            videoRef.value.pause();
        }

        const play = () => {
          videoRef.value.play()
        }


        const handle = {
          "切歌": nextMusic,
          "暂停": pause,
          '播放':play
        }

        const onCheck = async() => {
            if (checked.value) {
                 await transferRecognizer.listen(result => {
                    const { scores } = result;
                    const labels = transferRecognizer.wordLabels();
                    const index = scores.indexOf(Math.max(...scores));
                    label.value = labels[index]
                    handle[labels[index]]()
                }, {
                    overlapFactor: 0,
                    probabilityThreshold: 0.75
                });
            } else {
                transferRecognizer.stopListening();
            }
        }

        onMounted( async() => {
            const recognizer = speechCommands.create(
                'BROWSER_FFT',
                null,
                MODEL_PATH + '/speech/model.json',
                MODEL_PATH + '/speech/metadata.json',
            );
            await recognizer.ensureModelLoaded();
            transferRecognizer = recognizer.createTransfer('智能KTV');
            const res = await fetch(MODEL_PATH + '/music/data.bin');
            const arrayBuffer = await res.arrayBuffer();
            transferRecognizer.loadExamples(arrayBuffer);
            await transferRecognizer.train({ epochs: 30 });
        })

        return {
            label,
            music,
            checked,
            videoRef,

            onCheck
        }
    }
}
</script>