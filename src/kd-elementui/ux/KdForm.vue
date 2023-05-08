<script>
let { Form } = window.ElUI.ui;
export default {
  name: "KdForm",
  extends: Form,
  methods: {
    isValid() {
      return new Promise((resolve) => {
        this.validate((valid, obj) => {
          if (valid) {
            resolve(true);
          } else {
            for (let i in obj) {
              let errfield = this.fields.find(
                (field) => obj[i][0].field === field.prop
              );
              /* eslint-disable */

              SF.showTip(obj[i][0].message, () => {
                Ext.each(errfield.$children, (item) => {
                  if (typeof item.focus === "function") {
                    item.focus();
                    return false;
                  }
                });
              });
              /* eslint-disable */

              resolve(false);
              return false;
            }
          }
        });
      });
    },
  },
};
</script>
