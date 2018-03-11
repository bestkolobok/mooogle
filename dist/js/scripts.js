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
/*jshint esversion: 6 */

const colectionWrapper = document.getElementById('searchMovie');
if(window.location.pathname == "/"){


//находтим и подготавливаем шаблон карточки фильма для дальнейшей работы
const premieresFilm = document.getElementById('premieresFilm').textContent.trim();
const screenFilm = document.getElementById('screenFilm').textContent.trim();
const top100Film = document.getElementById('top100Film').textContent.trim();
const premieresSeries = document.getElementById('premieresSeries').textContent.trim();
const screenSeries = document.getElementById('screenSeries').textContent.trim();
const top100Series = document.getElementById('top100Series').textContent.trim();
const compiledPremieresFilm = _.template(premieresFilm);
const compiledScreenFilm = _.template(screenFilm);
const compiledTop100Film = _.template(top100Film);
const compiledPremieresSeries = _.template(premieresSeries);
const compiledScreenSeries = _.template(screenSeries);
const compiledTop100Series = _.template(top100Series);

var successGetUpcomming = function (res) {
    var data = JSON.parse(res);
        console.log(data);
    colectionWrapper.innerHTML += compiledPremieresFilm({data})
};
var successgetNowPlaying = function (res) {
    var data = JSON.parse(res);
    colectionWrapper.innerHTML += compiledScreenFilm({data})
};
var successgetTopRated = function (res) {
    var data = JSON.parse(res);
    colectionWrapper.innerHTML += compiledTop100Film({data})
};
var successgetOnTheAir = function (res) {
    var data = JSON.parse(res);
    colectionWrapper.innerHTML += compiledPremieresSeries({data})
};
var successgetAiringToday = function (res) {
    var data = JSON.parse(res);
    colectionWrapper.innerHTML += compiledScreenSeries({data})
};
var successgetTopRated = function (res) {
    var data = JSON.parse(res);
    colectionWrapper.innerHTML += compiledTop100Series({data})
};
var error = function () {
    console.log(arguments);
};

theMovieDb.movies.getUpcoming({ "language": "ru-RUS"  }, successGetUpcomming, error);
theMovieDb.movies.getNowPlaying({ "language": "ru-RUS"  }, successgetNowPlaying, error);
theMovieDb.movies.getTopRated({ "language": "ru-RUS"  }, successgetTopRated, error);
theMovieDb.tv.getOnTheAir({ "language": "ru-RUS"  }, successgetOnTheAir, error);
theMovieDb.tv.getAiringToday({ "language": "ru-RUS"  }, successgetAiringToday, error);
theMovieDb.tv.getTopRated({ "language": "ru-RUS"  }, successgetTopRated, error);

}
if(window.location.pathname == '/movie.html'){

var img = document.querySelector('.main_img');
var description = document.querySelector('.text_description')
var date = document.querySelector('.time_item')
var title = document.querySelector('.title')
var container = document.querySelector('.images');


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
  console.log(result);
  img.style.backgroundImage = `url('https://image.tmdb.org/t/p/w600_and_h900_bestv2/${result.poster_path}')`;
  description.textContent = result.overview;
  date.textContent = result.release_date;
  title.textContent = result.title;
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
  console.log(result);
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
  
  
}

let errorPeopleCB = function(){
  console.log(arguments);
}


theMovieDb.movies.getById({"id":284054, "language":"ru-RUS" }, successCB, errorCB)

theMovieDb.credits.getCredit({"id":284054, "language":"ru-RUS" }, successPeopleCB, errorPeopleCB)





const trailer = document.querySelector(".trailer-video");
const reviews = [];
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

theMovieDb.movies.getTrailers({ "id": 284054, "language": "ru-RUS" }, successGetTrailer, errorGetTrailer);
theMovieDb.movies.getReviews({ "id": 284054 }, successGetReview, errorGetReview);


}


window.addEventListener("click", function(e){

    if(e.target.classList.contains('movie-card__title')){
        this.location.replace('/movie.html');
    }
})



if(window.location.pathname == '/'){

let movie_collection = document.getElementById('searchMovie');
// getElementById вохвращает массивоподобный объект
// даже если DOM елемент на старнице один.
let search_blcok = Array.from(document.getElementsByClassName('search'));
search_blcok = search_blcok[0]; 
//место, куда пользователь вводит запрос
let searchInput_onFocus = function (){
    document.getElementById('search-form_input_search').style.border = 'none';
}

const onClick = (event) => {
    if (event.target.className === "Some Future Class") {
        search_blcok.classList.remove('search_hidden');
        movie_collection.classList.add('bg');
    }
    if (event.target.className !== "search" && !search_blcok.classList.contains('search_hidden')) {
        console.dir(search_blcok);
        search_blcok.classList.add('search_hidden');
    }
}

document.addEventListener("click", onClick);

}
/*jshint esversion: 6 */


//находтим и подготавливаем шаблон карточки фильма для дальнейшей работы
const card = document.getElementById('movie-card').textContent.trim();

//компилируем наш шаблон в метод с помощью Lodash для дальгейшего использования, где либо
const compiledCard = _.template(card);

//Находим место, куда мы будет вставлять карточки фильмов.


// метод, который будет выполнен в случае удачного обращения к API MovieDB
var successGetUpcomming = function successGetUpcomming(res) {

    // парсим JSON в объект
    var data = JSON.parse(res);


    // выводим его в консоль что бы было наглядно
    console.log('get movie list on search');
    console.log(data);
    console.log('////////////////////');

    // // var sortByName = document.getElementById("byName");
    // // let compareName = function (a, b) {
    // //     if (a.title < b.title)
    // //         return -1;
    // //     if (a.title > b.title)
    // //         return 1;
    // //     return 0;
    // // }
    // // sortByName.addEventListener('click', compareName);
    // // data.results.sort(compareName);

    // var sortByDate = document.getElementById("byDate");
    // let compareDate = function (a, b) {
    //     if (a.release_date > b.release_date)
    //         return -1;
    //     if (a.release_date < b.release_date)
    //         return 1;
    //     return 0;
    // }
    // sortByDate.addEventListener('click', compareDate);
    // data.results.sort(compareDate);



    //проходимся по коллекции фильмов из ответа и обьект каждого из фильмов 
    //передаем в ранее "скомпилированный" метод
    data.results.forEach(item => {
        // console.log(item);
        colectionWrapper.insertAdjacentHTML('beforeend', compiledCard({
            item
        }));
    });



};


// Метод, который будет вызван в случае ошибки при обращении к API MovieDB 

var errorGetUpcomming = function errorGetUpcomming() {
    console.log(arguments);
};


//обращение к методу библиотеки для получения списка предстоящих премьер
//данный метод приведен в качестве примера использования шаблона карточки фильма.
//За более детальной информацией обратитесь к документации библиотеки

if(window.location.pathname == '/sort.html')
theMovieDb.movies.getUpcoming({
    "language": "ru-RUS"
}, successGetUpcomming, errorGetUpcomming);
