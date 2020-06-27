<template>
    <Layout>
        <Header>
            <h1 class="font-light">{{ msg }}</h1>
        </Header>
        <Content>
            <Card>
                <div slot="title">
                    <p>onemoji:
                        <a :href="`https://explorer.harmony.one/#/address/${$store.data.EMOJI_ADDRESS}`">{{ $store.data.EMOJI_ADDRESS }}</a>
                        --
                        <a href="https://github.com/peekpi/onemoji/blob/master/sol/onemoji.sol" target="_blank">code</a>
                    </p>
                    <p>your address: <a :href="`https://explorer.harmony.one/#/address/${address}`">{{ address }} </a></p>
                    <p>your ONEMOJI: {{ tokenIDs.length }}</p>
                </div>
                <Input v-model="userseed" placeholder="your lucky number" :disabled="loading" />
                <Button type="primary" long @click="mint" :loading="loading">mint</Button>
                <RemoteSVG
                    v-for="tokenID in tokenIDs"
                    :tokenID="tokenID"
                    :key="tokenID.tokenID.toNumber()"
                />
            </Card>
        </Content>
    </Layout>
</template>

<script>
import RemoteSVG from "./RemoteSVG";
export default {
    name: "HelloWorld",
    data() {
        return {
            tokenIDs: [],
            userseed: null,
            loading: false,
            address: null,
        };
    },
    props: {
        msg: String
    },
    components: {
        RemoteSVG
    },
    mounted() {
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
                const contract = await this.$store.updateContact();
                window.c = contract;
                console.log("contract:", contract);
                let tx = contract.methods.buyToken(this.userseed).transaction;
                tx.value = new tx.value.constructor(String(20e18));
                tx.gasLimit = new tx.gasLimit.constructor("8000000");
                window.tx = tx;
                await this.$store.txCommit(tx);
                /*
                await tx.send({
                    from: hmy.hmySDK.crypto.fromBech32(account.address),
                    value: "20000000000000000000",
                    gas: "8000000"
                });*/
            } catch (e) {
                console.log("err:", e);
            }
            this.loading = false;
            this.myTokenAmount();
        },
        async myTokenAmount() {
            console.log("myTokenAmount:", window.harmony);
            if (!window.harmony) return;
            const hmy = this.$store.data.hmy;
            const account = await hmy.login();
            this.address = account.address;
            const contract = await this.$store.updateContact();
            const hexAddress = hmy.hmySDK.crypto.fromBech32(account.address);
            let balance = await contract.methods.balanceOf(hexAddress).call();
            console.log("myTokenAmount balance:", balance.toString());
            for (let i = this.tokenIDs.length; i < balance; i++) {
                let tokenID = await contract.methods
                    .tokenOfOwnerByIndex(hexAddress, i)
                    .call();
                console.log(tokenID.toNumber());
                let attribute = await contract.methods
                    .powerNLucks(tokenID)
                    .call();
                this.tokenIDs.unshift({
                    tokenID,
                    attribute
                });
            }
            if (!this.loading) setTimeout(this.myTokenAmount, 3000);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.font-light {
    color: azure;
}
</style>
