class GithubProfileBadge extends HTMLElement {
    constructor() {
        super()
        const shadowRoot = this.attachShadow({ mode: 'open' })
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
        this.shadowRoot.innerHTML = template
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

        this.shadowRoot.querySelectorAll('#avatar')[0].setAttribute('title', profile.name)
        this.shadowRoot.querySelectorAll('#avatar')[0].setAttribute('href', profile.url)
        this.shadowRoot.querySelectorAll('#avatar > img')[0].setAttribute('src', profile.avatarUrl)
        this.shadowRoot.querySelectorAll('#avatar > img')[0].setAttribute('alt', profile.username)
        this.shadowRoot.querySelectorAll('h2 > a')[0].setAttribute('href', profile.url)
        this.shadowRoot.querySelectorAll('h2 > a')[0].setAttribute('title', profile.url)
        this.shadowRoot.querySelectorAll('h2 > a')[0].innerHTML = `@${profile.username}`
        this.shadowRoot.querySelectorAll('h3')[0].innerHTML = profile.location || ''
        this.shadowRoot.querySelectorAll('#follower-container')[0].setAttribute('href', profile.url)
        this.shadowRoot.querySelectorAll('#follower-container > i').innerHTML = profile.followers
        this.shadowRoot.querySelectorAll('#repos-container')[0].setAttribute('href', profile.url)
        this.shadowRoot.querySelectorAll('#repos-container > i').innerHTML = profile.followers
        this.shadowRoot.querySelectorAll('#following-container')[0].setAttribute('href', profile.url)
        this.shadowRoot.querySelectorAll('#following-container > i').innerHTML = profile.followers
        performance.mark('update-component-mark-end')
        performance.measure('update-component-mark', 'update-component-mark-start', 'update-component-mark-end')
        let measures = performance.getEntriesByName('update-component-mark')
        performance.clearMarks()
        performance.clearMeasures()
        console.log(`Update Component ${measures[0].duration.toFixed(2)}`)
    }

    createTemplate(profile) {
        return `
            <style>
            @import url(https://fonts.googleapis.com/css?family=Titillium+Web:400,700,600);

            * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            }

            *:active, *:focus {
            border: 0;
            outline: 0;
            }

            a {
            text-decoration: none;
            display: inline-block;
            }

            #github--profile {
                width: 100%;
            }

            #github--profile__info {
                background: #fff;
                text-align: center;
                padding: 1.875rem .9375rem;
            }

            #github--profile__info img {
                width: 6.25rem;
                height: 6.25rem;
                border-radius: 50%;
                display: block;
                box-shadow: 0 0 0.0625rem rgba(0, 0, 0, 0.5);
            }

            #github--profile__info h2 a {
                font-size: 1.65rem;
                color: #2368bd;
            }

            #github--profile__info h3 {
                font-size: 1.1885rem;
                color: #bdcbce;
            }

            #github--profile__state {
                background: #1a4e8e;
                text-align: center;
                padding: 1.875rem .9375rem;
                border-radius: 0 0 .3125rem .3125rem;
            }

            #github--profile__state ul {
                direction: ltr;
            }

            #github--profile__state li {
                list-style: none;
                display: inline-block;
                margin-right: 1rem;
            }
            
            #github--profile__state li:last-child {
                margin-right: 0;
            }

            #github--profile__state a {
                color: #fff;
            }

            #github--profile__state i {
                font-size: 1.5rem;
                font-weight: 700;
                font-style: normal;
                display: block;
            }

            #github--profile__state span {
                font-size: .844rem;
                letter-spacing: .0625rem;
                color: #2776d7;
            }
            </style>
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

