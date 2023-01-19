<template>
    <h1>Form Folders Table</h1>
    <ActionBar 
        search-bar="enabled"
        download-all-button="enabled"
        :button-text=getButtonText
        :button-action=openNewFolderModal
        />
    <DataTable
        :rows=tableRows
        >
        <!-- pass in custom behaviours via slot or props -->
    </DataTable>
  </template>

<script>
import { fetchFormFolders } from '../api';
import { translate } from 'localization-library';
import DataTable from '@sandbox-monorepo-pseudocode/shared-component-library/DataTable.vue';
import ActionBar from '@sandbox-monorepo-pseudocode/shared-component-library/ActionBar.vue';

export default {
  components: {
    DataTable
  },
  data() {
    return {
        tableRows: []
    }
  },
  computed: {
    buttonText() {
      return translate('newFormFolder');
    }
  },
  mounted() {
    this.data.tableRows = fetchFormFolders('appSlug');
  },
  methods: {
    openEditFolderModal() {
      this.$emit('open-edit-folder-modal');
    },
    openNewFolderModal() {
      this.$emit('open-new-folder-modal');
    }
  }
}
</script>

<style>
.cool-custom-table-style {
    width: auto;
}
</style>