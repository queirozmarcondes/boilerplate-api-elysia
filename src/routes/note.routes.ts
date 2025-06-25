// src/routes/note.routes.ts
import { Elysia, t } from 'elysia'


class Note {
  constructor(public data: string[] = ['Moonhalo']) {}

  add(note: string) {
    this.data.push(note)
    return this.data
  }

  remove(index: number) {
    return this.data.splice(index, 1)
  }

  update(index: number, note: string) {
    return (this.data[index] = note)
  }
}

export const note = new Elysia({ prefix: '/note' })
  .use(numericParams())
  .decorate('note', new Note())
  .get(
    '/',
    ({ note }) => note.data,
    {
      detail: {
        title: 'List all notes',
        tags: ['Notes'],
        summary: 'List all notes',
        description: 'Returns the entire list of notes stored in memory.'
      },
      response: t.Array(t.String())
    }
  )
  .put(
    '/',
    ({ note, body: { data } }) => note.add(data),
    {
      detail: {
        title: 'Add new note',
        tags: ['Notes'],
        summary: 'Add new note',
        description: 'Adds a new note to the list.'
      },
      body: t.Object({
        data: t.String(),
      }),
      response: t.Array(t.String())
    }
  )
  .get(
    '/:index',
    ({ note, params: { index } }) => {
      if (note.data[index] !== undefined) return note.data[index]
      throw new Error('Not Found :(')
    },
    {
      detail: {
        title: 'Get note by index',
        tags: ['Notes'],
        summary: 'Get note by index',
        description: 'Returns a note from the list by its index.'
      },
      params: t.Object({
        index: t.Number(),
      }),
      response: t.String()
    }
  )
  .delete(
    '/:index',
    ({ note, params: { index } }) => {
      if (index in note.data) return note.remove(index)
      throw new Error('Unprocessable Entity')
    },
    {
      detail: {
        title: 'Delete note',
        tags: ['Notes'],
        summary: 'Delete note',
        description: 'Deletes a note by its index.'
      },
      params: t.Object({
        index: t.Number(),
      }),
      response: t.Array(t.String())
    }
  )
  .patch(
    '/:index',
    ({ note, params: { index }, body: { data } }) => {
      if (index in note.data) return note.update(index, data)
      throw new Error('Unprocessable Entity')
    },
    {
      detail: {
        title: 'Update note',
        tags: ['Notes'],
        summary: 'Update note',
        description: 'Updates a note by its index.'
      },
      params: t.Object({
        index: t.Number(),
      }),
      body: t.Object({
        data: t.String(),
      }),
      response: t.String()
    }
  )

function numericParams() {
  return new Elysia({ name: 'numeric-params' }).derive(({ params }) => {
    const typedParams = params as Record<string, unknown>;
    for (const key in typedParams) {
      const value = typedParams[key];
      if (typeof value === 'string' && !isNaN(Number(value))) {
        typedParams[key] = Number(value);
      }
    }
    return {
      params: typedParams
    }
  })
}

