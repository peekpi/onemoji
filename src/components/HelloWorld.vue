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
                    <p>totalSupply: {{ totalSupply }}/3470</p>
                    <p>your address: <a :href="`https://explorer.harmony.one/#/address/${address}`">{{ address }} </a></p>
                    <p>your ONE: {{ balanceOne?Number(balanceOne.toOne()).toFixed(2):'-' }}</p>
                    <p>your ONEMOJI: {{ tokenIDs.length }}</p>
                </div>
                <Input v-model="userseed" placeholder="your lucky number" :disabled="loading" />
                <Button type="primary" long @click="mint" :loading="loading" :disabled="disabled">mint rate {{ mintPercent }}%</Button>
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
            disabled: false,
            address: null,
            balanceOne: null,
            totalSupply: 0,
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
    computed:{
        mintPercent(){
            return ((1-this.totalSupply/3470)*100).toFixed(2);
        }
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
            if (this.loading) return;
            this.disabled = true;
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
            let balanceOne = await hmy.hmySDK.blockchain.getBalance(account);
            this.balanceOne = new hmy.hmySDK.utils.Unit(balanceOne.result).asWei();
            window.x = this.balanceOne;
            this.totalSupply = (await contract.methods.totalSupply().call()).toString();
            setTimeout(this.myTokenAmount, 3000);
            this.disabled = false;
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
