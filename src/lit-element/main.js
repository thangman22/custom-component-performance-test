'use strict';

import { LitElement, html } from '@polymer/lit-element';

class GithubProfileBadge extends LitElement {

    static get properties() { return { username: String } }

    constructor() {
        super()
        this.profile = {}
    }

    async connectedCallback() {
        super.connectedCallback()
        if (this.username) {
            this.profile = await this.fetchProfile(this.username)
            this._invalidateProperties()
            setTimeout(async () => {
                this.profile = await this.fetchProfile('GoogleChromeLabs')
                this._invalidateProperties()
            }, 10000)
        }
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

    _didRender() {
        performance.mark('create-component-mark-end')
        performance.measure('create-component-mark', 'create-component-mark-start', 'create-component-mark-end')
        let measures = performance.getEntriesByName('create-component-mark')
        performance.clearMarks()
        performance.clearMeasures()
        console.log(`Create Component ${measures[0].duration.toFixed(2)}`)
    }

    _render() {
        performance.mark('create-component-mark-start')
        return html`<style>
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
                    <a href="${this.profile.url}" target="_blank" title="${this.profile.name}" id="avatar">
                        <img src="${this.profile.avatarUrl}" alt="${this.profile.username}"/>
                    </a>
                    <h2>
                        <a href="${this.profile.url}" title="${this.profile.username}" target="_blank">@${this.profile.username}</a>
                    </h2>
                    <h3>${this.profile.location || ''}</h3>
                </div>
                <div id="github--profile__state">
                    <ul>
                        <li>
                            <a href="${this.profile.url}" target="_blank" id="follower-container" title="Number Of Followers">
                                <i>${this.profile.followers}</i>
                                <span>Followers</span>
                            </a>
                        </li>
                        <li>
                            <a href="${this.profile.url}" target="_blank" id="repos-container" title="Number Of Repositoriy">
                                <i>${this.profile.repos}</i>
                                <span>Repositoriy</span>
                            </a>
                        </li>
                        <li>
                            <a href="${this.profile.url}" target="_blank" id="following-container" title="Number Of Following">
                                <i>${this.profile.following}</i>
                                <span>Following</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </section>`;
    }

}

customElements.define('github-profile-badge', GithubProfileBadge);