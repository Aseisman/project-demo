<script>
export default {
  name: 'HeadRender',
  functional: true,
  props: {
    scope: Object,
    render: Function
  },
  render: (h, ctx) => {
    return ctx.props.render ? ctx.props.render(h, ctx) : ''
  }
}
</script>
