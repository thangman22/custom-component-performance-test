class GithubProfileBadge extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        let username = this.getAttribute('username')

        if (username) {
            this.renderTemplate(username)

            setTimeout(() => {
                this.updateTemplate('GoogleChromeLabs')
            }, 10000)
        }
    }

    async renderTemplate(username) {
        let profile = await this.fetchProfile(username)

        performance.mark('create-component-mark-start')
        let template = this.createTemplate(profile)
        this.innerHTML = template
        performance.mark('create-component-mark-end')
        performance.measure('create-component-mark', 'create-component-mark-start', 'create-component-mark-end')

        let measures = performance.getEntriesByName('create-component-mark')
        performance.clearMarks()
        performance.clearMeasures()
        console.log(`Create Component ${measures[0].duration.toFixed(2)}`)
    }

    async fetchProfile(username) {
        let request = await fetch(`https://api.github.com/users/${username}?client_id=debcd7873f058b255df6&client_secret=68daf6582e66220cac4e6fc555e62ee90c23d815`)
        let profile = await request.json()

        return {
            username: profile.login,
            url: profile.html_url,
            repos: profile.public_repos,
            followers: profile.followers,
            following: profile.following,
            location: profile.location,
            avatarUrl: profile.avatar_url
        }
    }

    async updateTemplate(username) {
        let profile = await this.fetchProfile(username)

        performance.mark('update-component-mark-start')

        this.querySelectorAll('#avatar')[0].setAttribute('title', profile.name)
        this.querySelectorAll('#avatar')[0].setAttribute('href', profile.url)
        this.querySelectorAll('#avatar > img')[0].setAttribute('src', profile.avatarUrl)
        this.querySelectorAll('#avatar > img')[0].setAttribute('alt', profile.username)
        this.querySelectorAll('h2 > a')[0].setAttribute('href', profile.url)
        this.querySelectorAll('h2 > a')[0].setAttribute('title', profile.url)
        this.querySelectorAll('h2 > a')[0].innerHTML = `@${profile.username}`
        this.querySelectorAll('h3')[0].innerHTML = profile.location || ''
        this.querySelectorAll('#follower-container')[0].setAttribute('href', profile.url)
        this.querySelectorAll('#follower-container > i').innerHTML = profile.followers
        this.querySelectorAll('#repos-container')[0].setAttribute('href', profile.url)
        this.querySelectorAll('#repos-container > i').innerHTML = profile.followers
        this.querySelectorAll('#following-container')[0].setAttribute('href', profile.url)
        this.querySelectorAll('#following-container > i').innerHTML = profile.followers
        performance.mark('update-component-mark-end')
        performance.measure('update-component-mark', 'update-component-mark-start', 'update-component-mark-end')
        let measures = performance.getEntriesByName('update-component-mark')
        performance.clearMarks()
        performance.clearMeasures()
        console.log(`Update Component ${measures[0].duration.toFixed(2)}`)
    }

    createTemplate(profile) {
        return `
            <section id="github--profile">
                <div id="github--profile__info">
                    <a href="${profile.url}" target="_blank" title="${profile.name}" id="avatar">
                        <img src="${profile.avatarUrl}" alt="${profile.username}"/>
                    </a>
                    <h2>
                        <a href="${profile.url}" title="${profile.username}" target="_blank">@${profile.username}</a>
                    </h2>
                    <h3>${profile.location || ''}</h3>
                </div>
                <div id="github--profile__state">
                    <ul>
                        <li>
                            <a href="${profile.url}" target="_blank" id="follower-container" title="Number Of Followers">
                                <i>${profile.followers}</i>
                                <span>Followers</span>
                            </a>
                        </li>
                        <li>
                            <a href="${profile.url}" target="_blank" id="repos-container" title="Number Of Repositoriy">
                                <i>${profile.repos}</i>
                                <span>Repositoriy</span>
                            </a>
                        </li>
                        <li>
                            <a href="${profile.url}" target="_blank" id="following-container" title="Number Of Following">
                                <i>${profile.following}</i>
                                <span>Following</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </section>`
    }
}


customElements.define('github-profile-badge', GithubProfileBadge);

