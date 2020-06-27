<template>
<div>
    <div class="border">
        <h3>
        <p>tokenID: {{ tokenID.tokenID }}</p>
        <p>power: {{ tokenID.attribute.power }}</p>
        <p>lucky: {{ tokenID.attribute.luck }}</p>
        </h3>
        <div class="center" :style="{width:`${tokenID.attribute.power}%`, opacity:tokenID.attribute.luck/100}" v-html="emoji"/>
    </div>
</div>
</template>

<script>
export default {
    name: "RemoteSVG",
    props: ["tokenID"],
    data(){
        this.updateEmoji();
        console.log(this.tokenID);
        return {
            emoji:"None",
        }
    },
    methods:{
        updateEmoji(){
            const tokenID = this.tokenID.tokenID;
            if(Number(tokenID) < 3470)
                this.$store.GetEmoji(tokenID).then(emoji=>this.emoji=emoji);
            else
                this.emoji = "None";
        }
    },
    watch:{
        tokenID(){
            this.updateEmoji();
        },
    }
}
</script>

<style scoped>
.center {
    margin: auto;
}
.border {
    border: medium double rgb(255, 251, 0);
}
</style>