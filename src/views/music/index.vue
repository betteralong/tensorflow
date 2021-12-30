<template>
    <div>
        <p>声控</p>
        监听开关：<input type="checkbox" v-model="checked" @change="onCheck" />
        <video ref="videoRef" class="material-detail__preview__video" controls="" :src="music"></video>
    </div>
</template>

<script>
import * as speechCommands from '@tensorflow-models/speech-commands';
import { ref, onMounted, nextTick } from "vue"
export default {
    setup() {
        const checked = ref(false)
        const videoRef = ref()
        let transferRecognizer;
        const MODEL_PATH = 'http://172.16.64.5:3000';


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
            console.log('audioRef.value',videoRef.value)
            // videoRef.value.pause();
            music.value = musicList[index];
            nextTick(() => {
                videoRef.value.play();
            })
        }

        const pause = () => {
            ideoRef.value.pause();
        }

        const onCheck = async() => {
            if (checked.value) {
                 await transferRecognizer.listen(result => {
                    const { scores } = result;
                    const labels = transferRecognizer.wordLabels();
                    const index = scores.indexOf(Math.max(...scores));
                    console.log('result', result)
                    // window.play(labels[index]);
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
            transferRecognizer = recognizer.createTransfer('轮播图');
            const res = await fetch(MODEL_PATH + '/slider/data.bin');
            const arrayBuffer = await res.arrayBuffer();
            transferRecognizer.loadExamples(arrayBuffer);
            await transferRecognizer.train({ epochs: 30 });
        })

        return {
            music,
            checked,
            videoRef,

            onCheck
        }
    }
}
</script>