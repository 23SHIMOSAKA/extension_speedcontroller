export function getVideo() {
    return document.querySelector('.video-stream');
}

export function showTooltip(button, message) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip-text');
    tooltip.textContent = message;
    document.body.appendChild(tooltip);

    const buttonRect = button.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${buttonRect.left + window.scrollX + (button.offsetWidth - tooltip.offsetWidth) / 2}px`;
    tooltip.style.top = `${buttonRect.top + window.scrollY + button.offsetHeight + 5}px`;
    tooltip.style.visibility = 'visible';

    setTimeout(() => {
        tooltip.remove();
    }, 3000);
}
