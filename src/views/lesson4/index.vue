<template>
    <div>
        <p>逻辑回归</p>
        <div>
            x: <input type="text" name="x" v-model="x">
            y: <input type="text" name="y" v-model="y">
            <button type="submit" @click="onPredict">预测</button>
        </div>
    </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { getData } from './data.js';
import { ref, onMounted } from "vue"

export default {
    setup() {
        const data = getData(400);
        let model;
        const x = ref(0);
        const y = ref(0);
        const onPredict = () => {
            const pred = model.predict(tf.tensor([[x.value * 1, y.value * 1]]));
            alert(`预测结果：${pred.dataSync()[0]}`);
        }

        onMounted(async() => {
             tfvis.render.scatterplot(
                { name: '逻辑回归训练数据' },
                {
                    values: [
                        data.filter(p => p.label === 1),
                        data.filter(p => p.label === 0),
                    ]
                }
            );
            model = tf.sequential();
            model.add(tf.layers.dense({
                units: 1,
                inputShape: [2],
                activation: 'sigmoid'
            }));
            model.compile({
                loss: tf.losses.logLoss,
                optimizer: tf.train.adam(0.1)
            });

            const inputs = tf.tensor(data.map(p => [p.x, p.y]));
            const labels = tf.tensor(data.map(p => p.label));

            await model.fit(inputs, labels, {
                batchSize: 40,
                epochs: 20,
                callbacks: tfvis.show.fitCallbacks(
                    { name: '训练效果' },
                    ['loss']
                )
            });

        })
        return {
            x,
            y,

            onPredict
        }
    }
}
</script>