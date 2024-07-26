const LabelMap = {
    1: { name: 'frente', color: 'orange' },
    2: { name: 'perfil', color: 'blue' },
    3: { name: 'trasero', color: 'red' },
};

export const drawRect = (boxes, classes, scores, threshold, imWidth, imHeight, ctx, video, handleHighConfidenceDetection, setConfidence) => {
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i] && classes[i] && scores[i] > threshold) {
            const [y, x, height, width] = boxes[i];
            const text = classes[i];
            const confidence = scores[i];

            const xi = x * imWidth;
            const yi = y * imHeight;
            const xf = (width * imWidth) - (x * imWidth);
            const yf = (height * imHeight) - (y * imHeight);

            ctx.strokeStyle = LabelMap[text]['color'];
            ctx.lineWidth = 2;
            ctx.fillStyle = LabelMap[text]['color'];
            ctx.font = '30px Arial';

            ctx.beginPath();
            ctx.fillText(`${LabelMap[text]['name']} - ${Math.round(confidence * 100)}%`, xi, yi - 10);
            ctx.rect(xi, yi, xf, yf);
            ctx.stroke();

            setConfidence(confidence);

            if (confidence >= 0.95) {
                handleHighConfidenceDetection(video);
            }
        }
    }
};
