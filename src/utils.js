//이메일 유효성 검사 정규표현식
export const validateEmail = email => {
    const regex = /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[0-9?A-z]+\.[A-z]{2}.?[A-z]{0,3}$/;
    return regex.test(email);
}

//공백제거
export const removeWhitespace = text => {
    const regex = /\s/g;
    return text.replace(regex,'');
}