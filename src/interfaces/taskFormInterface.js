import { ref } from "vue";

function taskFormInterface() {

  return {
    action: "create",
    inputs: {
      name: ref(null),
      category: ref(null),
      important: ref(false),
      date: {
        from: ref(null),
        to: ref(null)
      },
      completed: ref(false)
    },
  }
};

export default taskFormInterface
