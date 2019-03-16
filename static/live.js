const extractDate = node => moment(node.dataset.time)

// according to Moment.js docs, fromNow will not overlap with toNow. This is not true.
const timeDifference = date => (date.isAfter(moment())) ? date.fromNow() : date.fromNow()

// todo: move to localstorage
const notifiedEvents = {}
const pageLoad = moment().subtract(10, 'minutes')

const checkForUpstreamUpdates = () => {
    fetch(`https://api.github.com/repos/compsoc-edinburgh/htb19-site/commits?since=${pageLoad.toISOString()}`)
        .then(r => r.json())
        .then(r => {
            if (r.length !== 0)
                window.location.reload(true)
        })
}

const updateLive = () => {
    document.querySelectorAll('.live__scheduleitem').forEach(node => {
        const date = extractDate(node)

        // force reset the styling
        node.className = 'live__scheduleitem'

        // set the coundown
        node.querySelector('.live__scheduleitem__title--countdown').innerText = `${date.format('dddd hh:mma')} (${timeDifference(date)})`


        // if the date 
        if (date.isAfter(moment())) {
            // check if the date is less than ten minutes away
            let datecopy = moment(date)
            datecopy = datecopy.subtract(10, 'minutes')

            // if it is, check we haven't raised a notification before
            if (datecopy.isBefore(moment())) {
                if (!(node.dataset.time in notifiedEvents)) {
                    // first time
                    notifiedEvents[node.dataset.time] = true
                    
                    try {
                        let notification = new Notification(`${node.dataset.title} ${date.fromNow()}!`, {
                            badge: '/static/favicon.png',
                            icon: '/static/favicon.png'
                        })
                    } catch (e) {}

                }
            }

        } else {
            // check if the full duration is over if the event start is in the past.
            let datecopy = moment(date)
            if (node.dataset.duration !== '') {
                datecopy = datecopy.add(0 + node.dataset.duration, 'minutes')
            } else {
                datecopy = datecopy.add(60, 'minutes')
            }

            if (datecopy.isAfter(moment())) {
                // currently happening
                node.classList.add('live__scheduleitem--active')
                window.scrollTo({
                    'behavior': 'smooth',
                    'left': 0,
                    'top': node.offsetTop - 100
                })

            } else {
                node.classList.add('live__scheduleitem--passed')
            }
        }
    })
    
    // TODO: scroll if there are no active schedule items
}

const updateCountdown = () => {
    const endDate = moment('2019-03-17T12:00')
    const now = moment()

    document.querySelector('.live__countdown-show').innerText = `${endDate.diff(now, 'hours')} hours, ${endDate.diff(now, 'minutes') % 60} minutes, ${endDate.diff(now, 'seconds') % 60} seconds`
}

window.onload = () => {
    try {
        Notification.requestPermission()
    } catch (e) {}
    updateLive()

    // update every 5 minutes
    setInterval(updateLive, 5 * 60 * 1000)

    // update the coundown every 500 ms
    setInterval(updateCountdown, 500)
    updateCountdown()

    // check for updates
    setInterval(checkForUpstreamUpdates, 5 * 60 * 1000)
}


// super simple nav
document.querySelectorAll('[name="livenav"]').forEach(node => {
    node.addEventListener('change', ev => {
        const n = ev.target
        // if we're not checked, stop
        if (!n.checked) return;

        // otherwise update page state
        document.querySelectorAll('[data-nav]').forEach(section => {
            if (section.dataset.nav === n.value) {
                section.classList.remove('live--hidden')
            } else {
                section.classList.add('live--hidden')
            }
        })
    })

})
