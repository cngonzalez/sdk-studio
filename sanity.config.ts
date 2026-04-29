import {defineConfig, defineField, defineType} from 'sanity'

import {sdkPlugin} from './src/sdkPlugin'

const authorType = defineType({
  name: 'author',
  type: 'document',
  title: 'Author',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          {value: 'developer', title: 'Developer'},
          {value: 'designer', title: 'Designer'},
          {value: 'ops', title: 'Operations'},
        ],
      },
    }),
  ],
})

const bookType = defineType({
  name: 'book',
  type: 'document',
  title: 'Book',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'author', title: 'Author', type: 'reference', to: {type: 'author'}}),
  ],
})

export default defineConfig({
  name: 'default',
  title: 'SDK Studio',
  projectId: 'ppsg7ml5',
  dataset: 'test',
  plugins: [sdkPlugin()],
  schema: {
    types: [authorType, bookType],
  },
})
