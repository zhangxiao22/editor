const IS_IMG = ["bmp", "jpg", "jpeg", "gif", "png"];
const GET_LOCAL_IMG = (window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1) ?
    window.webkitURL.createObjectURL :
    window.URL.createObjectURL;