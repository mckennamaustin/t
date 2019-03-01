import getSuperclassName from './getSuperclassName';
export default function (element) {
    let html = undefined;
    if (getSuperclassName(element) === 'Component') {
        html = element.html();
    }
    else {
        html = element;
    }
    return html;
}
//# sourceMappingURL=reifyHTMLLike.js.map