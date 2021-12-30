<template>
    <div>tensorflow的优势</div>
</template>

<script>
import * as tf from '@tensorflow/tfjs';
export default {
    setup() {
        const input = [1, 2, 3];
        const w = [[1, 2, 3], [2, 3, 4], [3, 4, 5,], [4, 5, 6]];
        const output = [0, 0, 0, 0];

        for (let i = 0; i < w.length; i++) {
            for (let j = 0; j < input.length; j++) {
                output[i] += input[j] * w[i][j];
            }
        }

        console.log(output);

        const out = tf.tensor(w).dot(tf.tensor(input));
        out.print()
    }
}
</script>