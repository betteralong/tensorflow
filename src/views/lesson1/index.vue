<template>
    <div>初识tensorflow</div>
</template>

<script>
import * as tf from '@tensorflow/tfjs';
export default {
    setup() {
        const test1 = tf.tensor([1, 2, 3, 4, 5, 6])
        console.log(test1)
        test1.print()


        const test2 = tf.tensor([[1,2, 3],[4,5,6]])
         console.log(test2)
        test2.print()

        const shape = [2, 3]
        const test3 = tf.tensor([1, 2, 3, 4, 5, 6], shape)
         console.log(test3)
        test3.print()
    }
}
</script>