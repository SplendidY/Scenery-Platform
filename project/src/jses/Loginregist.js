import { ref } from 'vue'

let isRightPanelActive = ref(false);
let signUpUser = ref('');
let signUpPassword = ref('');
let signInUser = ref('');
let signInPassword = ref('');

const toggleSignIn = () => {
    isRightPanelActive.value = false;
};

const toggleSignUp = () => {
    isRightPanelActive.value = true;
};

// 前端代码微调
const handleSubmitSignUp = async () => {
    try {
        const response = await fetch('http://localhost:5001/register', {  // 确保 URL 是正确的，包括端口号
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: signUpUser.value,
                password: signUpPassword.value
            })
        });
        const data = await response.json();
        if (response.ok) {
            alert('注册成功！');
            toggleSignIn(); // 切换回登录界面
        } else {
            alert(`注册失败：${data.message}`);
        }
    } catch (error) {
        alert('网络错误或服务器无响应');
    }
};


const handleSubmitSignIn = async () => {
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: signInUser.value,
            password: signInPassword.value
        })
    });
    const data = await response.json();
    if (response.ok) {
        alert('登录成功！');
        // 可以在此处进行页面跳转或状态更新
    } else {
        alert(`登录失败：${data.message}`);
    }
};

export {
    isRightPanelActive,
    signUpUser,
    signUpPassword,
    signInPassword,
    signInUser,
    toggleSignIn,
    toggleSignUp,
    handleSubmitSignUp,
    handleSubmitSignIn
}
