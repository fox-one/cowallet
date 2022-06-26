<template>
  <div>
    <auth-modal />
    <pay-modal />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PayModal from "./PayModal.vue";
import AuthModal from "./AuthModal.vue";

@Component({
  components: {
    PayModal,
    AuthModal,
  },
})
class Modals extends Vue {}
export default Modals;
</script>
