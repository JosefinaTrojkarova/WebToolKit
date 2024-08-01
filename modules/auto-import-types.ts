import { defineNuxtModule, addImports } from '@nuxt/kit';

export default defineNuxtModule({
  setup() {
    const types = [
      'ItemBasicInfo',
      'Tool',
      'Alternative',
      'Review',
      'Category',
      'CategoryDatabase',
      'Tag',
      'User',
      'ToolSuggestion',
    ];

    types.forEach((type) => {
      addImports({
        from: '~~/types', // Assuming your types.ts file is in the root of your project
        name: type,
        as: type,
        type: true, // This indicates it's a type import
      });
    });
  },
});
