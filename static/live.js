const extractDate = node => moment(node.dataset.time)

// according to Moment.js docs, fromNow will not overlap with toNow. This is not true.
const timeDifference = date => (date.isAfter(moment())) ? date.fromNow() : date.fromNow()

// todo: move to localstorage
const notifiedEvents = {}

const update = () => {
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
                    
                    let notification = new Notification(`${node.dataset.title} ${date.fromNow()}!`, {
                        badge: '/static/favicon.png',
                        icon: '/static/favicon.png'
                    })

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

window.onload = () => {
    Notification.requestPermission()
    update()

    // update every 5 minutes
    setInterval(update, 5 * 60 * 1000)
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
