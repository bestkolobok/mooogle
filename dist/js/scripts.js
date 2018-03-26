/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 - 2017 Franco Cavestri
 *
 * https://github.com/cavestri/themoviedb-javascript-library
 *
 */

var theMovieDb = {};

theMovieDb.common = {
    api_key: "b4a2ddcffbf736c3e738a03f5fcc609c",
    base_uri: "http://api.themoviedb.org/3/",
    images_uri: "http://image.tmdb.org/t/p/",
    timeout: 5000,
    generateQuery: function (options) {
        'use strict';
        var myOptions, query, option;

        myOptions = options || {};
        query = "?api_key=" + theMovieDb.common.api_key;

        if (Object.keys(myOptions).length > 0) {
            for (option in myOptions) {
                if (myOptions.hasOwnProperty(option) && option !== "id" && option !== "body") {
                    query = query + "&" + option + "=" + myOptions[option];
                }
            }
        }
        return query;
    },
    validateCallbacks: function (callbacks) {
        'use strict';
        if (typeof callbacks[0] !== "function" || typeof callbacks[1] !== "function") {
            throw "Success and error parameters must be functions!";
        }
    },
    validateRequired: function (args, argsReq, opt, optReq, allOpt) {
        'use strict';
        var i, allOptional;

        allOptional = allOpt || false;

        if (args.length !== argsReq) {
            throw "The method requires  " + argsReq + " arguments and you are sending " + args.length + "!";
        }

        if (allOptional) {
            return;
        }

        if (argsReq > 2) {
            for (i = 0; i < optReq.length; i = i + 1) {
                if (!opt.hasOwnProperty(optReq[i])) {
                    throw optReq[i] + " is a required parameter and is not present in the options!";
                }
            }
        }
    },
    getImage: function (options) {
        'use strict';
        return theMovieDb.common.images_uri + options.size + "/" + options.file;
    },
    client: function (options, success, error) {
        'use strict';
        var method, status, xhr;

        method = options.method || "GET";
        status = options.status || 200;
        xhr = new XMLHttpRequest();

        xhr.ontimeout = function () {
            error('{"status_code":408,"status_message":"Request timed out"}');
        };

        xhr.open(method, theMovieDb.common.base_uri + options.url, true);

        if(options.method === "POST") {
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
        }

        xhr.timeout = theMovieDb.common.timeout;

        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === status) {
                    success(xhr.responseText);
                } else {
                    error(xhr.responseText);
                }
            } else {
                error(xhr.responseText);
            }
        };

        xhr.onerror = function (e) {
            error(xhr.responseText);
        };
        if (options.method === "POST") {
            xhr.send(JSON.stringify(options.body));
        } else {
            xhr.send(null);
        }
    }
};

theMovieDb.configurations = {
    getConfiguration: function (success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "configuration" + theMovieDb.common.generateQuery()
            },
            success,
            error
        );
    }
};

theMovieDb.account = {
    getInformation: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "account" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getLists: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "account/" + options.id + "/lists" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getFavoritesMovies: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "account/" + options.id + "/favorite_movies" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    addFavorite: function (options, success, error) {
        'use strict';
        var body;

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id", "movie_id", "favorite"]);

        theMovieDb.common.validateCallbacks([success, error]);

        body = {
            "movie_id": options.movie_id,
            "favorite": options.favorite
        }


        theMovieDb.common.client(
            {
                url: "account/" + options.id + "/favorite" + theMovieDb.common.generateQuery(options),
                status: 201,
                method: "POST",
                body: body
            },
            success,
            error
        );
    },
    getRatedMovies: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "account/" + options.id + "/rated_movies" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getWatchlist: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "account/" + options.id + "/movie_watchlist" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    addMovieToWatchlist: function (options, success, error) {
        'use strict';

        var body;

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id", "movie_id", "movie_watchlist"]);

        theMovieDb.common.validateCallbacks([success, error]);

        body = {
            "movie_id": options.movie_id,
            "movie_watchlist": options.movie_watchlist
        }

        theMovieDb.common.client(
            {
                url: "account/" + options.id + "/movie_watchlist" + theMovieDb.common.generateQuery(options),
                method: "POST",
                status: 201,
                body: body
            },
            success,
            error
        );
    }
};

theMovieDb.authentication = {
    generateToken: function (success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "authentication/token/new" + theMovieDb.common.generateQuery()
            },
            success,
            error
        );
    },
    askPermissions: function(options){
       'use strict';

       window.open("https://www.themoviedb.org/authenticate/" + options.token + "?redirect_to=" + options.redirect_to);

    },
    validateUser: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["request_token", "username", "password"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "authentication/token/validate_with_login" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    generateSession: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["request_token"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "authentication/session/new" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    generateGuestSession: function (success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "authentication/guest_session/new" + theMovieDb.common.generateQuery()
            },
            success,
            error
        );
    }
};

theMovieDb.certifications = {
    getList: function (success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "certification/movie/list" + theMovieDb.common.generateQuery()
            },
            success,
            error
        );
    }
};

theMovieDb.changes = {
    getMovieChanges: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/changes" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getPersonChanges: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "person/changes" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }
};

theMovieDb.collections = {
    getCollection: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "collection/" + options.id + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getCollectionImages: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "collection/" + options.id + "/images" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }

};

theMovieDb.companies = {
    getCompany: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "company/" + options.id + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getCompanyMovies: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "company/" + options.id + "/movies" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }

};

theMovieDb.credits = {
    getCredit: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/credits" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }
};

theMovieDb.discover = {
    getMovies: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "discover/movie" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getTvShows: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "discover/tv" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }

};

theMovieDb.find = {
    getById: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id", "external_source"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "find/" + options.id + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }
};

theMovieDb.genres = {
    getList: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "genre/movie/list" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getMovies: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "genre/" + options.id + "/movies" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getTVList: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "genre/tv/list" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }

};

theMovieDb.jobs = {
    getList: function (success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "job/list" + theMovieDb.common.generateQuery()
            },
            success,
            error
        );
    }
};

theMovieDb.keywords = {
    getById: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "keyword/" + options.id + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getMovies: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "keyword/" + options.id + "/movies" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }
};

theMovieDb.lists = {
    getById: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "list/" + options.id + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getStatusById: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id", "movie_id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "list/" + options.id + "/item_status" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    addList: function (options, success, error) {
        'use strict';

        var body;

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "name", "description"]);

        theMovieDb.common.validateCallbacks([success, error]);

        body = {
            "name": options.name,
            "description": options.description
        };

        delete options.name;
        delete options.description;

        if(options.hasOwnProperty("language")) {
            body["language"] = options.language;

            delete options.language;
        }

        theMovieDb.common.client(
            {
                method:  "POST",
                status: 201,
                url: "list" + theMovieDb.common.generateQuery(options),
                body: body
            },
            success,
            error
        );
    },
    addItem: function (options, success, error) {
        'use strict';

        var body;

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id", "media_id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        body = {
            "media_id": options.media_id
        };

        theMovieDb.common.client(
            {
                method:  "POST",
                status: 201,
                url: "list/" + options.id + "/add_item" + theMovieDb.common.generateQuery(options),
                body: body
            },
            success,
            error
        );
    },
    removeItem: function (options, success, error) {
        'use strict';

        var body;

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id", "media_id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        body = {
            "media_id": options.media_id
        };

        theMovieDb.common.client(
            {
                method:  "POST",
                status: 201,
                url: "list/" + options.id + "/remove_item" + theMovieDb.common.generateQuery(options),
                body: body
            },
            success,
            error
        );
    },
    removeList: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                method:  "DELETE",
                status: 204,
                url: "list/" + options.id + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    clearList: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id", "confirm"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                method:  "POST",
                status: 204,
                body: {},
                url: "list/" + options.id + "/clear" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }
};

theMovieDb.movies = {
    getById: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getAlternativeTitles: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/alternative_titles" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getCredits: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/credits" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getImages: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/images" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getKeywords: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/keywords" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getReleases: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/releases" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getTrailers: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/trailers" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getVideos: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/videos" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getTranslations: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/translations" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getRecommendations: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/recommendations" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getSimilarMovies: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/similar_movies" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getReviews: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/reviews" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getLists: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/lists" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getChanges: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/changes" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getLatest: function (success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/latest" + theMovieDb.common.generateQuery()
            },
            success,
            error
        );
    },
    getUpcoming: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/upcoming" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getNowPlaying: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/now_playing" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getPopular: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/popular" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getTopRated: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/top_rated" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getStatus: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "movie/" + options.id + "/account_states" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    rate: function (options, rate, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 4, options, ["session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                method:  "POST",
                status: 201,
                url: "movie/" + options.id + "/rating" + theMovieDb.common.generateQuery(options),
                body: { "value": rate }
            },
            success,
            error
        );
    },
    rateGuest: function (options, rate, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 4, options, ["guest_session_id", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                method:  "POST",
                status: 201,
                url: "movie/" + options.id + "/rating" + theMovieDb.common.generateQuery(options),
                body: { "value": rate }
            },
            success,
            error
        );
    }
};

theMovieDb.networks = {
    getById: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "network/" + options.id + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }
};

theMovieDb.people = {
    getById: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "person/" + options.id + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getMovieCredits: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "person/" + options.id + "/movie_credits" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getTvCredits: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "person/" + options.id + "/tv_credits" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getCredits: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "person/" + options.id + "/combined_credits" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getExternalIds: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "person/" + options.id + "/external_ids" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getImages: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "person/" + options.id + "/images" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
	getTaggedImages: function(options, success, error) {
		'use strict';

		theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

		 theMovieDb.common.client(
            {
                url: "person/" + options.id + "/tagged_images" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
	},
    getChanges: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "person/" + options.id + "/changes" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getPopular: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "person/popular" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getLatest: function (success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "person/latest" + theMovieDb.common.generateQuery()
            },
            success,
            error
        );
    }
};

theMovieDb.reviews = {
    getById: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "review/" + options.id + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }
};

theMovieDb.search = {
    getMovie: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "search/movie" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getCollection: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "search/collection" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getTv: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "search/tv" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getPerson: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "search/person" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getList: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "search/list" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getCompany: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "search/company" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getKeyword: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "search/keyword" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getMulti: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["query"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "search/multi" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }
};

theMovieDb.timezones = {
    getList: function (success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 2);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "timezones/list" + theMovieDb.common.generateQuery()
            },
            success,
            error
        );
    }
};

theMovieDb.tv = {
    getById: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getAlternativeTitles: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/alternative_titles" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getContentRatings: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/content_ratings" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getCredits: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/credits" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getExternalIds: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/external_ids" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getImages: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/images" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getKeywords: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/keywords" + theMovieDb.common.generateQuery(options)
            },
            success,
            error            
        );

    },
    getRecommendations: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/recommendations" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },    
    getSimilar: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/similar" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },    
    getTranslations: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/translations" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getVideos: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/videos" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getAiringToday: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/airing_today" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getLatest: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/latest" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getOnTheAir: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/on_the_air" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getPopular: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/popular" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getTopRated: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, "", "", true);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/top_rated" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }    
};

theMovieDb.tvSeasons = {
    getById: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/season/" + options.season_number + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getCredits: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/season/" + options.season_number + "/credits" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getExternalIds: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/season/" + options.season_number + "/external_ids" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getImages: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/season/" + options.season_number + "/images" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getVideos: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/season/" + options.season_number + "/videos" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }
};

theMovieDb.tvEpisodes = {
    getById: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["episode_number", "season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/season/" + options.season_number + "/episode/" + options.episode_number + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getCredits: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["episode_number", "season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/season/" + options.season_number + "/episode/" + options.episode_number + "/credits" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getExternalIds: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["episode_number", "season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/season/" + options.season_number + "/episode/" + options.episode_number + "/external_ids" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getImages: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["episode_number", "season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/season/" + options.season_number + "/episode/" + options.episode_number + "/images" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    },
    getVideos: function (options, success, error) {
        'use strict';

        theMovieDb.common.validateRequired(arguments, 3, options, ["episode_number", "season_number", "id"]);

        theMovieDb.common.validateCallbacks([success, error]);

        theMovieDb.common.client(
            {
                url: "tv/" + options.id + "/season/" + options.season_number + "/episode/" + options.episode_number + "/videos" + theMovieDb.common.generateQuery(options)
            },
            success,
            error
        );
    }
};


(function checkStorage () {
    if(localStorage.Mooogle === undefined){
        localStorage.Mooogle = JSON.stringify([]);
    }
})();

const favorites = {
    
    store: [],

    getStore: function() {
        const mooogleStore = JSON.parse(localStorage.Mooogle);

        console.log(mooogleStore);

        this.store = mooogleStore.favorites === undefined ? [] : mooogleStore.favorites;
        return this;
    },

    saveStore: function() {
        const mooogleStore = JSON.parse(localStorage.Mooogle);
        mooogleStore.favorites = this.store;
        localStorage.Mooogle = JSON.stringify(mooogleStore);
    },

    add: function(id) {
        
        this.store = [...this.store, ...[id]];
        console.log(this)
        this.saveStore();
    },

    getAll: function() {

    }
};

favorites.getStore();

window.addEventListener('click', (event)=>{
    if(event.target.classList.contains('movie-card__button--favorite'))
    {
        console.log('movieCard', event.target);
        const movieId = event.target.dataset.id;

        favorites.add(movieId);

    }
});
window.addEventListener("load", function(){


    let swipearea = document.getElementById("wrapper");
    let button = document.querySelector("#button");
    let a = document.querySelector(".menu");
    let search = document.querySelector(".head__search");
    let lines = document.getElementsByClassName("button__line");
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    swipearea.addEventListener("touchstart", function(e){
        console.log(e.changedTouches[0].clientX);
        startX = e.changedTouches[0].clientX;
        startY = e.changedTouches[0].clientY;
    }, false)

    swipearea.addEventListener("touchend", function(e){
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        if(endX-startX>0){
        	if(a.classList.contains("move-left")){
						a.classList.remove("move-left");
        	}
        	a.classList.add("move-right");
            lines[1].style.display = "none";
            lines[0].classList.add("transformed-1");
            lines[2].classList.add("transformed-2");
        }
        else if(endX-startX<=0){
        	if(a.classList.contains("move-right")){
        		a.classList.remove("move-right");
        	}
        a.classList.add("move-left");
        lines[1].style.display = "block";
        lines[0].classList.remove("transformed-1");
        lines[2].classList.remove("transformed-2");
      	}
    }, false)
    button.addEventListener('click', function(){
					if(a.classList.contains("move-right")){
						a.classList.remove("move-right");
						a.classList.add("move-left");
                        lines[1].style.display = "block";
                        lines[0].classList.remove("transformed-1");
                        lines[2].classList.remove("transformed-2");
					}
					else{
						a.classList.add("move-right");
						a.classList.remove("move-left");
                        lines[1].style.display = "none";
                        lines[0].classList.add("transformed-1");
                        lines[2].classList.add("transformed-2");
					}
    }, false)
    search.addEventListener('click', function(){
				document.querySelector(".head").style.display = "none";
				document.querySelector(".head-1").style.display = "flex";
    }, false)
}, false)


var error = function () {
    console.log(arguments);
};

const upcommingFilmWrapper = document.getElementById('upcoming_film');
const TopFilmWrapper = document.getElementById('top_rated_film');
const PlayingFilmWrapper = document.getElementById('now_playing_film');
const upcommingSeriesWrapper = document.getElementById('upcoming_series');
const TopSeriesWrapper = document.getElementById('top_rated_series');
const PlayingSeriesWrapper = document.getElementById('now_playing_series');


//проверки на нулл не убирать, они нужны если страница отличная от стартовой,
//что бы не выпадали при отсутсвии блоков


if(upcommingFilmWrapper !== null)
    theMovieDb.movies.getUpcoming({ "language": "ru-RUS"  },  upcommingFilm, error);
    
if(PlayingFilmWrapper !== null)
    theMovieDb.movies.getNowPlaying({ "language": "ru-RUS"  }, PlayingFilm, error);
    
if(TopFilmWrapper !== null)
    theMovieDb.movies.getTopRated({ "language": "ru-RUS"  }, TopFilm, error);

if(upcommingSeriesWrapper !== null)
    theMovieDb.tv.getOnTheAir({ "language": "ru-RUS"  }, upcommingSeries, error);

if(PlayingSeriesWrapper !== null)
    theMovieDb.tv.getAiringToday({ "language": "ru-RUS"  }, PlayingSeries, error);

if(TopSeriesWrapper !== null)
    theMovieDb.tv.getTopRated({ "language": "ru-RUS"  }, TopSeries, error);

function prepareResult (res, count) {

    const data = JSON.parse(res);
    return data.results.splice(0, count);
}

function upcommingFilm (res){

    const toShow = prepareResult(res, 4);
  
    toShow.forEach((item, i) => {
        upcommingFilmWrapper.insertAdjacentHTML('beforeend', compiledCard({item}));
    });
}

function TopFilm (res){

    const toShow = prepareResult(res, 4);

    toShow.forEach((item, i) => {
        TopFilmWrapper.insertAdjacentHTML('beforeend', compiledCard({item}));
    });
}

function PlayingFilm (res){

    const toShow = prepareResult(res, 4);

    toShow.forEach((item, i) => {
        PlayingFilmWrapper.insertAdjacentHTML('beforeend', compiledCard({item}));
    });
}

function upcommingSeries (res){

    const toShow = prepareResult(res, 4);

    toShow.forEach((item, i) => {
        upcommingSeriesWrapper.insertAdjacentHTML('beforeend', compiledCard({item}));
    });
}

function TopSeries (res){

    const toShow = prepareResult(res, 4);

    toShow.forEach((item, i) => {
        TopSeriesWrapper.insertAdjacentHTML('beforeend', compiledCard({item}));
    });
}

function PlayingSeries (res){

    const toShow = prepareResult(res, 4);

    toShow.forEach((item, i) => {
        PlayingSeriesWrapper.insertAdjacentHTML('beforeend', compiledCard({item}));
    });
}

function openCaption(evt, caption) {
    var i, moviesWrapper, tabLinks;

    moviesWrapper = document.getElementsByClassName("movies-wrapper");
    for (i = 0; i < moviesWrapper.length; i++) {
        moviesWrapper[i].style.display = "none";
    }

    tabLinks = document.getElementsByClassName("tab_links");

    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace("active", "");

    }

    document.getElementById(caption).style.display = "block";
    evt.currentTarget.className += " active";
}



if(window.location.pathname == '/movie.html'){

var img = document.querySelector('.card__img');
var description = document.querySelector('.description__text');
var date = document.querySelector('.links__time--item');
var title = document.querySelector('.card__about--title');
var container = document.querySelector('.images');
var tableCountry = document.querySelector(".table-country");
var tableTagline = document.querySelector(".table-tagline");
var tableFilmtype = document.querySelector(".table-filmtype");
var tableRuntime = document.querySelector(".table-runtime");
var tableProducer = document.querySelector(".table-producer");
var tableFilmContent = document.querySelector(".table-filmcontent");
var partSlide = document.querySelectorAll(".part-slide");
var arrowLeft = document.querySelector(".arrow-left");
var arrowRight = document.querySelector(".arrow-right");
var ulSlider = document.querySelector(".part-slider");
var arrowLeftActors = document.querySelector(".arrow-left__actors");
var arrowRightActors = document.querySelector(".arrow-right__actors");





var width = 80; 
var count = 1; 
var index = 0;


var carousel = document.getElementById('carousel');
var list = carousel.querySelector('.images');


// var infinitecarousel = new InfiniteCarousel('.images', 'horizontal', 3, {
  //     timerDuration: 2000,
  //     transitionDuration: '1s'
  //   });
  
  
  var position = 0; 
  
  
  
  let successCB = function(res) {
    const result = JSON.parse(res);
    // console.log(result);
  img.style.backgroundImage = `url('https://image.tmdb.org/t/p/w600_and_h900_bestv2/${result.poster_path}')`;
  description.textContent = result.overview;
  date.textContent = result.release_date;
  title.innerHTML = result.title;
  tableCountry.textContent = `${result.production_countries[0].iso_3166_1}, ${result.production_countries[0].name}`;
  tableTagline.textContent = result.tagline;
  for(let i = 0; i < result.genres.length; i++){
    tableFilmtype.textContent += `${result.genres[i].name}, `;
  }
  tableRuntime.textContent = `${result.runtime} мин`;
}

let errorCB = function() {
  console.log(arguments);

}

var galleryItems = {
  text: [],
  img: [],
}


let successPeopleCB = function(res) {
  const result = JSON.parse(res);
  // console.log(result);
  tableProducer.textContent = result.crew[1].name;
  tableFilmContent.textContent = result.crew[0].name;
  for (let i = 0; i < 10; i++){
    galleryItems.text.push(result.cast[i].name);
    galleryItems.img.push(`https://image.tmdb.org/t/p/w600_and_h900_bestv2${result.cast[i].profile_path}`);
  }
  const html = document.querySelector('#gallery-item').textContent.trim();
  const compiled = _.template(html);
  
  var resultCompiled = compiled(galleryItems);
  
  container.innerHTML = resultCompiled;

  var listElems = carousel.querySelectorAll('.images_item');


  var initialPoint;
  var finalPoint;

  list.addEventListener('touchstart', function(event) {
  event.preventDefault();
  event.stopPropagation();
  initialPoint=event.changedTouches[0];
    for(let i = 0; i < listElems.length; i++){
      var clone = listElems[i].cloneNode(true);
      list.appendChild(clone);

    }

  }, false);

  list.addEventListener('touchend', function(event) {
  event.preventDefault();
  event.stopPropagation();
  finalPoint=event.changedTouches[0];

    // for(let i = 0; i < listElems.length; i++){
    //   var clone = listElems[i].cloneNode(true);
    //   list.insertBefore(clone, listElems[i]);

    // }

    index++;

  var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
  if (xAbs > 20) {
    console.log(listElems.length+index);
    if (finalPoint.pageX < initialPoint.pageX){
      position = Math.max(position - width * count, -width * ((listElems.length + index) - count*4));
      list.style.marginLeft = position + 'px';
    } else{
      position = Math.min(position + width * count, 0)
      list.style.marginLeft = position + 'px';}
    }
  }, false);
  
  arrowLeftActors.addEventListener("click", function(){
    position = Math.min(position + width * count, 0)
    list.style.marginLeft = position + 'px';
  });
  arrowRightActors.addEventListener("click", function(){
    position = Math.max(position - width * count, -width * (8 - count*4));
    list.style.marginLeft = position + 'px';
  });
  
}

let errorPeopleCB = function(){
  console.log(arguments);
}

var countPart = 1;
var positionPart = 0; 
 

let successPeopleImagesCB = function(res){
  const result = JSON.parse(res);
  console.log(result);
  let widthPart = 130;
  for(let i = 0; i < partSlide.length; i++){
    partSlide[i].style.backgroundImage = `url("https://image.tmdb.org/t/p/w600_and_h900_bestv2${result.backdrops[i].file_path}")`
  };
  arrowLeft.addEventListener("click", function(){
    positionPart = Math.min(positionPart + widthPart * countPart, 0)
    ulSlider.style.marginLeft = positionPart + 'px';
  });
  arrowRight.addEventListener("click", function(){
    positionPart = Math.max(positionPart - widthPart * countPart, -widthPart * (8 - countPart*4));
    ulSlider.style.marginLeft = positionPart + 'px';
  });
}

let errorPeopleImagesCB = function(){
  console.log(arguments);
}


theMovieDb.movies.getById({"id":269149, "language":"ru-RUS" }, successCB, errorCB);

theMovieDb.credits.getCredit({"id":269149, "language":"ru-RUS" }, successPeopleCB, errorPeopleCB);

theMovieDb.movies.getImages({"id":269149}, successPeopleImagesCB, errorPeopleImagesCB)

const trailer = document.querySelector(".trailer-video");
var reviews = [];
const reviewContainer = document.querySelector("#reviews-container");
const trailerHidden = document.querySelector(".trailer");

let successGetTrailer = function (res) {
    const result = JSON.parse(res);
    console.log(result);
    if (result.youtube.length === 0) {
        trailerHidden.setAttribute("style", "display: none;");
    } else {
        trailer.setAttribute("src", `https://www.youtube.com/embed/${result.youtube[0].source}`);
    }
}

let errorGetTrailer = function (res) {
    console.log(arguments);
}

let successGetReview = function (res) {
    const result = JSON.parse(res);
    let reviewInfo = {};
    for (let i = 0; i < result.results.length; i++) {
        reviewInfo.author = result.results[i].author;
        reviewInfo.content = result.results[i].content;
        reviews.push(reviewInfo);
        reviewInfo = {};
    }
    console.log(reviews);
    const html = document.querySelector('#reviews-main').textContent.trim();
    const compiled = _.template(html);
    const r = compiled(reviews);
    reviewContainer.innerHTML = r;


    let posts = document.querySelectorAll(".big-post");
    console.log(posts);
    posts.forEach(item => {
        let onClick = event => {
            if (event.target !== event.currentTarget) {
                if (item.classList.contains("reviews-text-big")) {
                    item.classList.remove("reviews-text-big");
                    item.classList.add("reviews-text");
                    item.innerHTML = `${reviews[0].content.slice(0, 152)}...<a class="more-info"><span>еще</span></a>`;
                } else {
                    item.classList.add("reviews-text-big");
                    item.classList.remove("reviews-text");
                    item.innerHTML = `${reviews[0].content}<a class="more-info"><span>свернуть</span></a>`;
                }
            }
        };
        item.addEventListener("click", onClick);
    });
}

let errorGetReview = function (res) {
    console.log(arguments);
}

theMovieDb.movies.getTrailers({ "id": 269149, "language": "ru-RUS" }, successGetTrailer, errorGetTrailer);
theMovieDb.movies.getReviews({ "id": 269149 }, successGetReview, errorGetReview);



}



//находтим и подготавливаем шаблон карточки фильма для дальнейшей работы
const card = document.getElementById('movie-card').textContent.trim();

//компилируем наш шаблон в метод с помощью Lodash для дальгейшего использования, где либо
const compiledCard = _.template(card);

    


window.addEventListener("click", function(e){

    if(e.target.classList.contains('movie-card__title')){
        this.location.replace('/movie.html');
    }
})



let movie_collection = document.getElementById('black_background');
let search_blcok = document.getElementById('search');

//место, куда пользователь вводит запрос
let searchInput_onFocus = function () {
    document.getElementById('search-form_input_search').style.border = 'none';
};

const onClick = (event) => {
    if (event.target.className === "head-1__search" || event.target.className === "head-1__input-search" || event.target.className === "head__search" || event.target.classList.contains('search-form_input_search')) {
        search_blcok.classList.remove('search_hidden');
        search_blcok.classList.add('search_show');
        movie_collection.classList.add('black_background');
    } else if (search_blcok.classList.contains('search_show') && !event.target.classList.contains('search') && !event.target.classList.contains('logo') && event.target.nodeName !== 'INPUT') {
        search_blcok.classList.add('search_hidden');
        search_blcok.classList.remove('search_show');
        movie_collection.classList.remove('black_background');
    }
};

if(search_blcok !== null)
    document.addEventListener("click", onClick);

/*jshint esversion: 6 */



//кнопка сортировки по ИД
const sortButtonDate = document.getElementById('sortByDate');

//кнопка сортировки по имени
const sortButtonName = document.getElementById('sortName');

//блок в который вставляем результат
const colectionWrapper = document.getElementById('sortedMovie');

var sortResult;


// метод для сортировки от меньшего к большему
function sortASC (data, param) {
    //return data.sort((a, b) => a[param] > b[param])
    return data.sort((a, b) => a[param].localeCompare(b[param]));
}

// метод для сортировки от большего к меньшему
function sortDESC (data, param) {
    //return data.sort((a, b) => b[param] > a[param])
    return data.sort((a, b) =>b[param].localeCompare(a[param]));
}


// метод, который будет повешен на событие onclick всех кнопок сортировки
function sort (event) {

    // определяем по чему был клик
    const button = event.target;

    //определяем из поля data-param описанного на кнопке, по какому параметру будем сортировать
    const param = button.dataset.param;

    //определяем из поля data-order описанного на кнопке, какой порядок сортировки будем использовать
    const order = button.dataset.order;

    //Определяем "направление" сортировки в текущий момент, и записываем в параметр кнопки data-order противоположное значение,
    //что бы при следующем нажатии сортировка сработала в другом "направлении".
    const changedOrder = order === 'ASC' ? 'DESC' : 'ASC';
    button.dataset.order = changedOrder;

    //в зависимости от текущего типа сортировки применяем тот или инной метод
    const ordered = order === 'ASC' ? sortASC(sortResult.results, param) : sortDESC(sortResult.results, param);

    console.log('{results: ordered}', order);
    console.log({results: ordered});

    //выводим отсортированый массив.
    renderResult({results: ordered});
}


// метод, который будет выполнен в случае удачного обращения к API MovieDB
var successGetUpcomming = function successGetUpcomming(res) {

    console.log('//////', 'get_movies from db')

    // парсим JSON в объект
    var data = JSON.parse(res);

    console.log(data);

    sortResult = data;

    renderResult(data);
};

function renderResult(data){

    //проходимся по коллекции фильмов из ответа и обьект каждого из фильмов 
    //передаем в ранее "скомпилированный" метод
    colectionWrapper.innerHTML = '';
    data.results.forEach(item => {
        
        colectionWrapper.insertAdjacentHTML('beforeend', compiledCard({
            item
        }));
    });
}


// Метод, который будет вызван в случае ошибки при обращении к API MovieDB 

var errorGetUpcomming = function errorGetUpcomming() {
    console.log(arguments);
};


//обращение к методу библиотеки для получения списка предстоящих премьер
//данный метод приведен в качестве примера использования шаблона карточки фильма.
//За более детальной информацией обратитесь к документации библиотеки

if(window.location.pathname == '/sort.html'){

    theMovieDb.movies.getUpcoming({
        "language": "ru-RUS"
    }, successGetUpcomming, errorGetUpcomming);

    sortButtonName.onclick = sort;
    sortButtonDate.onclick = sort;

}
