<template>
  <Layout>
    <b-row>
      <b-col xl="6">
        <SampleWrapper title="Border spinner">
          <template v-slot:sub-text> Use the border spinners for a lightweight loading indicator. </template>
          <template v-slot:preview>
            <b-spinner class="m-2">
              <span class="visually-hidden">Loading...</span>
            </b-spinner>
          </template>
        </SampleWrapper>

        <SampleWrapper title="Colors">
          <template v-slot:sub-text> You can use any of our text color utilities on the standard spinner. </template>
          <template v-slot:preview>
            <b-spinner variant="primary" class="m-2"></b-spinner>
            <b-spinner variant="secondary" class="m-2"></b-spinner>
            <b-spinner variant="success" class="m-2"></b-spinner>
            <b-spinner variant="danger" class="m-2"></b-spinner>
            <b-spinner variant="warning" class="m-2"></b-spinner>
            <b-spinner variant="info" class="m-2"></b-spinner>
            <b-spinner variant="light" class="m-2"></b-spinner>
            <b-spinner variant="dark" class="m-2"></b-spinner>
          </template>
        </SampleWrapper>

        <SampleWrapper title="Alignment">
          <template v-slot:sub-text> Use flexbox utilities, float utilities, or text alignment utilities to place spinners exactly where you need them in any situation. </template>
          <template v-slot:preview>
            <div class="d-flex justify-content-center">
              <b-spinner></b-spinner>
            </div>
          </template>
        </SampleWrapper>

        <SampleWrapper title="Size">
          <template v-slot:sub-text> Add <code>.spinner-border-sm</code> and <code>.spinner-border.avatar-**</code> to make a smaller spinner that can quickly be used within other components. </template>
          <template v-slot:preview>
            <b-row>
              <b-col lg="6">
                <b-spinner variant="primary" class="m-2 avatar-lg" role="status"></b-spinner>
                <b-spinner type="grow" variant="secondary" class="m-2 avatar-lg" role="status"></b-spinner>
              </b-col>

              <b-col lg="6">
                <b-spinner variant="primary" class="m-2 avatar-md"></b-spinner>
                <b-spinner type="grow" variant="secondary" class="m-2 avatar-md"></b-spinner>
              </b-col>

              <b-col lg="6">
                <b-spinner variant="primary" class="m-2 avatar-sm"></b-spinner>
                <b-spinner type="grow" variant="secondary" class="m-2 avatar-sm"></b-spinner>
              </b-col>

              <b-col lg="6">
                <b-spinner small class="m-2"></b-spinner>
                <b-spinner small type="grow" class="m-2"></b-spinner>
              </b-col>
            </b-row>
            <!--end row-->
          </template>
        </SampleWrapper>
      </b-col>
      <!-- end col -->

      <b-col xl="6">
        <SampleWrapper title="Growing spinner">
          <template v-slot:sub-text> If you don’t fancy a border spinner, switch to the grow spinner. While it doesn’t technically spin, it does repeatedly grow! </template>
          <template v-slot:preview>
            <b-spinner type="grow" class="m-2">
              <span class="visually-hidden">Loading...</span>
            </b-spinner>
          </template>
        </SampleWrapper>

        <SampleWrapper title="Color Growing spinner">
          <template v-slot:sub-text> You can use any of our text color utilities on the standard spinner. </template>
          <template v-slot:preview>
            <b-spinner type="grow" variant="primary" class="m-2"></b-spinner>
            <b-spinner type="grow" variant="secondary" class="m-2"></b-spinner>
            <b-spinner type="grow" variant="success" class="m-2"></b-spinner>
            <b-spinner type="grow" variant="danger" class="m-2"></b-spinner>
            <b-spinner type="grow" variant="warning" class="m-2"></b-spinner>
            <b-spinner type="grow" variant="info" class="m-2"></b-spinner>
            <b-spinner type="grow" variant="light" class="m-2"></b-spinner>
            <b-spinner type="grow" variant="dark" class="m-2"></b-spinner>
          </template>
        </SampleWrapper>

        <SampleWrapper title="Placement">
          <template v-slot:sub-text> Use <code>flexbox utilities</code>, <code>float utilities</code>, or <code>text alignment</code> utilities to place spinners exactly where you need them in any situation. </template>
          <template v-slot:preview>
            <div class="d-flex align-items-center">
              <strong>Loading...</strong>
              <b-spinner class="ms-auto"></b-spinner>
            </div>
          </template>
        </SampleWrapper>

        <SampleWrapper title="Buttons spinner">
          <template v-slot:sub-text> Use spinners within buttons to indicate an action is currently processing or taking place. You may also swap the text out of the spinner element and utilize button text as needed. </template>
          <template v-slot:preview>
            <b-row>
              <b-col lg="6">
                <div class="d-flex flex-wrap gap-2">
                  <b-button variant="primary" disabled>
                    <b-spinner small></b-spinner>
                    <span class="visually-hidden">Loading...</span>
                  </b-button>
                  <b-button variant="primary" disabled>
                    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    Loading...
                  </b-button>
                </div>
              </b-col>
              <b-col lg="6">
                <div class="d-flex flex-wrap gap-2">
                  <b-button variant="primary" disabled>
                    <b-spinner type="grow" small></b-spinner>
                    <span class="visually-hidden">Loading...</span>
                  </b-button>
                  <b-button variant="primary" disabled>
                    <span class="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span>
                    Loading...
                  </b-button>
                </div>
              </b-col>
            </b-row>
          </template>
        </SampleWrapper>
      </b-col>
    </b-row>
  </Layout>
</template>

<script>
import Layout from "@/components/layout/layout.vue";
import SampleWrapper from "@/template-resources/sample-wrapper.vue";
export default {
  components: { Layout, SampleWrapper },
};
</script>
