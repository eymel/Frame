<template lang="pug">
  .App

    HeaderView

    .Columns
      Notes
      Tasks
      Calendar

</template>

<script>
  import 'quill/dist/quill.bubble.css'
  import Header from './components/global/header'
  import Notes from './components/note'
  import Tasks from './components/task'
  import Calendar from './components/calendar'

  export default {
    name: 'App',

    components: {
      HeaderView: Header,
      Notes,
      Tasks,
      Calendar
    }
  }
</script>

<style>
  :root {
    --border-radius: 4px;
    --transition: 150ms;
    --border-line-height: 1px;
    --border-line-color: rgba(0, 0, 0, .1);
    --color-note: #FFFBF2;
    --color-task: #21B663;
    --color-calander: #FF3845;
    --color-shadow: rgba(0, 0, 0, .1);
    --color-lighter: rgba(0, 0, 0, .2);
    --color-light: rgba(0, 0, 0, .5);
    --color-note-primary: #D3B41E;
    --font-size-small: 14px;
  }

  * {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;

    &,
    &:before,
    &:after {
      box-sizing: inherit;
    }
  }

  html {
    box-sizing: border-box;
  }

  input,
  textarea,
  select,
  button {
    font: inherit;
  }

  table {
    border-spacing: 0;
    width: 100%;
  }

  svg {
    display: inline-block;
    vertical-align: middle;
  }

  button {
    cursor: pointer;
    background-color: transparent;
  }

  body {
    font-size: 16px;
    line-height: 1.4;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    color: #232323;
    background-color: #E1E1E1;
    height: 100vh;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
  }

  .btn {
    display: flex;
    align-items: center;
    padding-left: 12px;
    padding-right: 12px;
    height: 40px;
    line-height: 1;

    .icon {
      margin-right: 3px;
    }

    &.--small {
      height: 30px;

      .icon {
        margin-right: 0;
      }
    }
  }

  .App {
    overflow: hidden;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .Header {
    height: 120px;
    flex-shrink: 0;
  }

  .Columns {
    height: 100%;
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(calc(33% - 10px), 1fr));
  }

  .Column {
    display: flex;
    flex-direction: column;
    background-color: #FFF;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
    border-radius: 10px;

    &-header {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30px;

      .title {
        font-size: 28px;
        line-height: 1;
      }

      .new {
        transition: var(--transition);
        opacity: 0;
        border-radius: 20px;
        color: white;
        font-size: var(--font-size-small);
        text-decoration: none;

        .icon {
          margin-left: -6px;
        }
      }
    }

    &-body {
      flex-grow: 1;
      padding-bottom: 50px;
    }

    &:hover &-header .new {
      opacity: 1;
    }

    &-shadow {
      height: 100%;
      border: 4px dashed var(--color-shadow);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 50px;

      .note {
        text-align: center;
        font-size: 18px;
        color: var(--color-lighter);
      }
    }

  }

  .ql-container {
    font: inherit;

    .ql-editor {
      padding: 20px 0;
      line-height: inherit;

      &.ql-blank::before {
        left: 0;
        font-style: normal;
        right: 0;
      }
    }
  }

</style>
