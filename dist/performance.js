(async () => {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            const metricName = entry.name
            const time = Math.round(entry.startTime + entry.duration)
            console.log(metricName, time)
        }
    });
    observer.observe({ entryTypes: ['paint'] })
})();



function measureCRP() {
    var t = window.performance.timing,
        interactive = t.domInteractive - t.domLoading,
        dcl = t.domContentLoadedEventStart - t.domLoading,
        complete = t.domComplete - t.domLoading;
    var stats = document.createElement('p');
    
    stats.textContent = 'interactive: ' + interactive + 'ms, ' +
        'dcl: ' + dcl + 'ms, complete: ' + complete + 'ms';
    console.log('dcl ' + dcl)
    console.log('dom load completed ' + complete)

    document.body.appendChild(stats);
}