import { defineNuxtModule, addImports } from '@nuxt/kit';

export default defineNuxtModule({
  setup() {
    const types = [
      'ItemBasicInfo',
      'Tool',
      'ToolMain',
      'ToolHeader',
      'Alternative',
      'Review',
      'Resources',
      'Category',
      'CategoryDatabase',
      'Tag',
      'User',
      'ToolSuggestion',
    ];

    types.forEach((type) => {
      addImports({
        from: '~~/types',
        name: type,
        as: type,
        type: true,
      });
    });
  },
});
