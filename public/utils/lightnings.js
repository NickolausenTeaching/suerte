/* not original */
function generarRayo() {
    const svg = document.getElementById("svgContainer");
    const ancho = window.innerWidth;
    const altura = window.innerHeight;
    const xInicio = Math.random() * ancho;
    let yActual = 0;
    let zigzag = `M${xInicio},${yActual}`;
    let grosor = Math.random() * 3 + 1;
    let color = Math.random() > 0.5 ? 'yellow' : 'yellow';

    for (let i = 0; i < Math.random() * 3 + 5; i++) {
        let xOffset = (Math.random() - 0.5) * 100;
        let yOffset = Math.random() * 100 + 50;
        yActual += yOffset;
        zigzag += ` L${xInicio + xOffset},${yActual}`;

        if (Math.random() > 0.7) {
            let branchX = xInicio + xOffset + (Math.random() - 0.5) * 50;
            let branchY = yActual + Math.random() * 30;
            zigzag += ` M${xInicio + xOffset},${yActual} L${branchX},${branchY}`;
        }
    }

    const linea = document.createElementNS("http://www.w3.org/2000/svg", "path");
    linea.setAttribute("d", zigzag);
    linea.setAttribute("class", "rayo");
    linea.setAttribute("stroke", color);
    linea.setAttribute("stroke-width", grosor);
    svg.appendChild(linea);

    document.body.style.animation = 'flash 0.2s';
    setTimeout(() => {
        document.body.style.animation = '';
        linea.remove();
    }, 700);
}

setInterval(() => {
    const t = setTimeout(() => {
        generarRayo()
        clearTimeout(t)
    }, Math.random() * 10000 + 500);
}, 5000)