const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        const metricName = entry.name
        const time = Math.round(entry.startTime + entry.duration)
        console.log(metricName, time)
    }
});
observer.observe({ entryTypes: ['paint']})
