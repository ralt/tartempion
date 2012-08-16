tartempion
===

Introduction
---

All the web frameworks out there don't suit my needs.

They're good, really, and I inspired myself from them to build `tartempion`.

But they either miss the dependency injection, or they're not decoupled enough. Or none of them.

So I built my own framework, based on [express][1] and [ncore][2].

Express is well known, it is already a web framework, and `tartempion` basically wraps express
with the dependency injection niceness that ncore provides.

Documentation
---

### The pies concept

In tartempion, there are pies. A pie is a kind. It has its own controller, and its own model.
It has only one of them.

There, you grasped the pies concept.

`tartempion` has no way to know which pies are installed though. So you have to define them somewhere.
This somewhere is the `pies.json` file in the root folder.

This is how it is defined:

    {
        "pieName": {
            "path": "pathToPie"
        },
        "anotherPie": {
            "path": "pathToAnother",
            "dependencies": [
                "pieName"
            ]
        }
    }

Firstly, it is important to know that all the pies will remain in the `pies/` folder.

`pieName` is the name of the pie. `pathToPie` is the name of the path, not including `pies/`. Finally, `dependencies` defines the dependencies of this pie. This way, you will be able to reach `pieName`'s controller in `anotherPie`.

As simple as that.

A pie is composed of *at least* three files: `controller.js`, `model.js` and `routes.json`.

### Define some routes

All the pies define the routes they handle. They're defined in the `routes.json` file. Here is an example of such a file:

    {
        "get": [
            { "/pages": "index" },
            { "/pages/:pid": "read" },
            { "/pages/edit/:pid": "editForm" }
        ],
        "post": [
            { "/pages/edit/:pid": "edit" }
        ]
    }

As you can see, `GET` and `POST` routes are separated. You define the route to use
(express.js routes, [look here for a more thorough documentation][3]), and the function
in the controller.

For example, in the `controller.js` file of this pie, we will find this:

    module.exports = {
        index: function( req, res ) {
        },

        read: function( req, res ) {
        },

        editForm: function( req, res ) {
        },

        edit: function( req, res ) {
        }
    };

That's pretty much it about the routes.

### Control everything

Just a little while ago, you saw how a controller is defined.

More information:

- The `controller.js` file is expected to return an object having all the methods specified in the routes.
- In these methods, you have access to `this.model`. This object is the model defined in `model.js`.
- If you have defined dependencies in the `pies.json` file, you will access them using `this.pieName`.
- If you have a `setup` method or an `init` method, they will be run once when the server will start. (setup first)

### Model all the things

![Model all the things][4]

The `model.js` file is where you define the methods usable in the `controller.js` file.

This is also where you define your model. If you use mongoose, this'd be where the Schemas are defined.

### And don't worry

Then, just don't worry! The models are automatically injected in the controllers, the dependencies are injected wherever it's needed! So you don't have to worry. Just code.

Installation
---

`git clone https://github.com/Ralt/tartempion && cd tartempion && npm install`

This repository is an example. You can look around to see how it's working.

Roadmap
---

- Add middlewares support &#10003;
- Add views helpers support &#10003;
- Add database support &#10003;
- Add a more thorough config.json file &#10003;
- Create a useful sample app &#10003; ([done][5])
- Refactor the core.js file &#10003;
- Create a module pushable to npm &infin;
- Create a CLI interface to use tartempion globally &#10005;
- Create a mocha interface to test the pies (individually or all together) &#10005;
- Create tests for tartempion &#10005;
- Update the documentation &#10005;
- Push to npm &#10005;

License
---

The MIT License (MIT)

Copyright (c) 2012 Florian Margaine

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


   [1]: http://expressjs.com
   [2]: https://github.com/Raynos/ncore
   [3]: http://expressjs.com/guide.html#routing
   [4]: http://i.imgur.com/vjqri.png
   [5]: https://github.com/Ralt/tartempion-blog

