import{ ref } from 'vue'
let isRightPanelActive = ref(false);
let signUpUser = ref('');
let signUpPassword = ref('');
let signInPassword = ref('');
let signInUser = ref('');

const toggleSignIn = () => {
    isRightPanelActive.value = false;
};

const toggleSignUp = () => {
    isRightPanelActive.value = true;
};

const handleSubmitSignUp = () => {
// 处理注册表单提交
};

const handleSubmitSignIn = () => {
// 处理登录表单提交
};
export {
    isRightPanelActive,
    signUpUser,
    signUpPassword,
    signInPassword,
    signInUser,
    toggleSignIn,
    toggleSignUp
}