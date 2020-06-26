<template>
    <div class="hello">
        <Card>
            <p slot="title">{{ msg }}</p>
            <Input v-model="userseed" placeholder="your lucky number" :disabled="loading" />
            <Button type="primary" long @click="mint" :loading="loading">mint</Button>
            <RemoteSVG v-for="tokenID in tokenIDs" :tokenID="tokenID" :key="tokenID.tokenID.toNumber()" />
        </Card>
    </div>
</template>

<script>
import RemoteSVG from "./RemoteSVG";
export default {
    name: "HelloWorld",
    data() {
        return {
            tokenIDs: [],
            userseed: null,
            loading: false
        };
    },
    props: {
        msg: String
    },
    components: {
        RemoteSVG
    },
    mounted(){
      setTimeout(this.myTokenAmount, 2000);
    },
    methods: {
        async mint() {
            if (window.harmony == null) {
                window.alert("please install math wallet!");
                return;
            }
            this.loading = true;

            try {
                const hmy = this.$store.data.hmy;
                const account = await hmy.login();
                const contract = await this.$store.updateContact();
                window.c = contract;
                console.log("contract:", contract);
                await contract.methods.buyToken(this.userseed).send({
                    from: hmy.hmySDK.crypto.fromBech32(account.address),
                    value: "20000000000000000000",
                    gas: "8000000"
                });
            } catch (e) {
                console.log("err:", e);
            }
            this.loading = false;
        },
        async myTokenAmount() {
            console.log("myTokenAmount:", window.harmony);
            if (!window.harmony) return;
            const hmy = this.$store.data.hmy;
            const account = await hmy.login();
            const contract = await this.$store.updateContact();
            const hexAddress = hmy.hmySDK.crypto.fromBech32(account.address);
            let balance = await contract.methods.balanceOf(hexAddress).call();
            console.log("myTokenAmount balance:", balance.toString());
            for (let i = this.tokenIDs.length; i < balance; i++) {
                let tokenID = await contract.methods
                    .tokenOfOwnerByIndex(hexAddress, i)
                    .call();
                console.log(tokenID.toNumber());
                let attribute = await contract.methods.powerNLucks(tokenID).call();
                this.tokenIDs.unshift({
                  tokenID,
                  attribute
                });
            }

            setTimeout(this.myTokenAmount, 3000);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
