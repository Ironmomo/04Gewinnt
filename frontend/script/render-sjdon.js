function createSJDONElement(type, attr, content, ...children) {
    const toReturn = content === undefined 
    ? [type, attr, ...children]
    : [type, attr, content, ...children]
    return toReturn
}

function renderSJDON(element, appRoot) {
    const htmlNodes = []

    element.forEach(el => {
        if(Array.isArray(el)) {
            if(el.length == 3) {
                if(typeof el[2] === "string") {
                    htmlNodes.push(elt(el[0],el[1],el[2]))
                } else {
                    const pNode = elt(el[0],el[1])
                    renderSJDON(el[2],pNode)
                    htmlNodes.push(pNode)
                }
            } else if(typeof el[1] === "string") {
                htmlNodes.push(elt(el[0],undefined,el[1]))
            } else {
                htmlNodes.push(elt(el[0], el[1]))
            }
        }
    })

    if(Array.isArray(element[0])) {
        appRoot.replaceChildren(...htmlNodes)
    } else if(typeof element[1] === "object" && typeof element[2] === "string"){
        const node = elt(element[0],element[1],element[2],htmlNodes)
        appRoot.replaceChildren(node)
    } else {
        const node = elt(element[0],element[1],undefined,htmlNodes)
        appRoot.replaceChildren(node)
    }
}

function elt(type, attr, content, children) {
    const el = document.createElement(type)
    for (const key in attr) {
        el.setAttribute(key,attr[key])
    }
    el.textContent = content
    if(!children) return el
    children.forEach(child => el.appendChild(child))
    return el
}

//how to use
//const app = document.getElementById("app")
//const elements = createSJDONElement("div", {style: "background:salmon"}, undefined,["h1","Hello There"],["p",{style: "background:blue"}, "whats up"])
//renderSJDON(elements, app)

export {renderSJDON, createSJDONElement}