var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__);
function setBaseNumberPileUp(base = '0', order = 'asc', length) {
    const baseNumber = +base;
    let stack = 0;
    let res;
    return () => {
        res = order === 'asc'
            ? baseNumber + stack
            : baseNumber - stack;
        stack += 1;
        return res.toString().padStart(length, '0');
    };
}
figma.ui.onmessage = (payload) => __awaiter(this, void 0, void 0, function* () {
    yield figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    const { prefix, baseNumber, order, type } = payload;
    const nodes = figma.currentPage.selection;
    const nodesLength = nodes.length;
    if (type === 'generate') {
        const isInvalid = nodes.some(node => node.type !== 'TEXT');
        if (isInvalid) {
            return "Select a single text node.";
        }
        const genNextNumber = setBaseNumberPileUp(baseNumber, order, baseNumber.length);
        for (let i = 0; i < nodesLength; i += 1) {
            //! Noted: order of page selections are not reliable.
            const result = `${prefix}${genNextNumber()}`;
            nodes[i].characters = result;
            nodes[i].name = result;
        }
    }
    // on cancel
    if (type === 'cancel') {
        figma.closePlugin();
    }
});
