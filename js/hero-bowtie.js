(function () {
    var card = document.querySelector('.hero-main-card');
    var tri = document.querySelector('.hero-center-triangle');
    var bowtie = document.querySelector('.concentric-bowtie-container');
    var nestedCard = document.querySelector('.hero-bottom-nested-card');
    var statsRow = document.querySelector('.hero-stats-row');

    function set(prop, val) {
        if (bowtie) {
            bowtie.style.setProperty(prop, val, 'important');
        }
    }

    function place() {
        if (card && tri && bowtie) {
            var c = card.getBoundingClientRect();
            var t = tri.getBoundingClientRect();
            var isDesktop = window.innerWidth >= 992;
            if (!isDesktop) {
                var cx = t.left - c.left + t.width / 2;
                var cy = t.top - c.top + t.height / 2;
                set('left', cx + 'px');
                set('top', cy + 'px');
                set('right', 'auto');
                set('transform', 'translate(-50%, -50%)');
            } else {
                if (bowtie) {
                    bowtie.style.removeProperty('left');
                    bowtie.style.removeProperty('top');
                    bowtie.style.removeProperty('right');
                    bowtie.style.removeProperty('transform');
                }
            }
        }

        // On mobile (< 768px), move the nested card out of the dark hero card so it sits on the pale mint background right above the stat cards (matching reference image 3)
        if (nestedCard && statsRow && card) {
            if (window.innerWidth < 768) {
                if (nestedCard.parentNode !== statsRow.parentNode) {
                    statsRow.parentNode.insertBefore(nestedCard, statsRow);
                }
            } else {
                if (nestedCard.parentNode !== card) {
                    card.appendChild(nestedCard);
                }
            }
        }
    }

    window.addEventListener('load', place);
    window.addEventListener('resize', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    place();
})();
