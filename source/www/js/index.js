
let list;
var app = {
    // Application Constructor
    initialize: function () {
        if (typeof (Storage) === "undefined") {
            $("main").html("Sorry, you can't use this app without local storage...");
            return null;
        }

        list = getFromStrorage();
        if (list == null) {
            
            console.log("Loading new list");
            
            let items = [
                new ToDoListItem("Go Shopping", "amco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in repreh", "https://www.abc.net.au/news/image/11159072-3x2-940x627.jpg"),
            ];

             list = new ToDoList(items);
             localStorage.setItem("list", JSON.stringify(list));

        }

        $(".toDoListItems").html(list.getHTML());
        $(".finishedItems").html(list.getHTML(true));
        
        $(".addItemConfirm").click(function (e) {
            $(list.addItem(
                new ToDoListItem($("#title").val(), $("#desc").val(), $("#img").val(), false)
            ).getHTML()).appendTo($(".toDoListItems"));
            attachEvents();

        });

        attachEvents();

        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("pause", this.onPause.bind(this), false);
        document.addEventListener("resume", this.onResume.bind(this), false);

    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
    },

    // // Update DOM on a Received Event
    // receivedEvent: function (id) {
    //     var parentElement = document.getElementById(id);
    //     var listeningElement = parentElement.querySelector('.listening');
    //     var receivedElement = parentElement.querySelector('.received');

    //     listeningElement.setAttribute('style', 'display:none;');
    //     receivedElement.setAttribute('style', 'display:block;');

    //     console.log('Received Event: ' + id);
    // }

    
    onPause: function () {
        if ($("#blinder").length <= 0)
            $("body").append(`<div id="blinder" class="faded">Paused</div>`);

    },

    onResume: function () {
        $("#blinder").html("Welcome back");
        $("#blinder").fadeOut(1000, function() { $(this).remove(); })
    },

};

function getFromStrorage() {
    let json = JSON.parse(localStorage.getItem("list"));
    if (json == null || json == undefined ) return null;

    let list = new ToDoList([]);

    for (let i = 0; i < json.items.length; i++) {
        list.items.push(
            new ToDoListItem(
                json.items[i].title,
                json.items[i].description,
                json.items[i].imageUrl,
                json.items[i].finished
            )
        );
    }
    return list;
}
class ToDoList {
    constructor(items) {
        this.items = items;
    }
    getJSON() {
        var json = {items:[]};
        for (let i = 0; i < this.items.length; i++) {
            json.items.push(this.items[i]);
        }
        return json;
    }
    getHTML(finished) {

        let html = ``;
        
        for (let i = 0; i < this.items.length; i++) {
            if(finished) {
                if (this.items[i].finished)
                    html += this.items[i].getHTML();

            } else {
                if (!this.items[i].finished)
                    html += this.items[i].getHTML();
            }
        }

        return html
    }
    revert(target) {
        let item = this.items[this.getIndexByID(target[0].id)];
        item.finished = false;
        this.updateStorage();
        target.remove();

        $(item.getHTML()).appendTo($(".toDoListItems"));
        attachEvents();

    }
    finish(target) {
        let item = this.items[this.getIndexByID(target[0].id)];
        item.finished = true;
        this.updateStorage();
        target.remove();

        $(item.getHTML()).appendTo($(".finishedItems"));

        attachEvents();

    }
    remove(target) {
        this.items.splice(this.getIndexByID(target[0].id), 1);
        this.updateStorage();
        target.html("");

    }
    updateStorage() {
        localStorage.setItem("list", JSON.stringify(this));
    }
    getIndexByID(id) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id == id) return i;
        }
    }
    addItem(item) {
        this.items.push(item);
        this.updateStorage();
        return item;
    }
}
var listId = 0;
class ToDoListItem {
    constructor(title, description, imageUrl, finished) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.finished = finished;
        this.id = listId++;

    }
    getJSON() {
        return {
            title: this.title,
            description: this.description,
            imageUrl: this.imageUrl,
            id: this.id,
            finished: this.finished
        };
    }
    getHTML() {
        return `
        
            <div class="mb-2 toDoListItem card promoting-card" id="${this.id}">
            <div
            class="card-body "
            style="display: flex; justify-content: space-between; align-items: center; "
            >
            <div class="d-flex flex-row">
                <img
                src="${this.imageUrl}"
                id="${this.id}-image-small"
                class="rounded-circle mr-3"
                width="50px"
                height="50px"
                alt="avatar"
                />

                <div>
                <h4 class="card-title font-weight-bold mb-2">${this.title}</h4>
                </div>
            </div>
            <a
                class=" red-text  rotating-button"
                style="display:block; font-size: 30px;"
                onclick="toggleImage(${this.id}); $(this).toggleClass('spin')"
                aria-controls="collapseContent"
                ><i class="fa fa-arrow-down" aria-hidden="true"></i>
            </a>
            </div>

            <div class="view overlay">
            <img
                class="card-img-top rounded-0 hidden"
                id="${this.id}-image-large"
                src="${this.imageUrl}"
                alt="${this.title}"
            />
            <a href="#!">
                <div class="mask rgba-white-slight"></div>
            </a>
            </div>

            <!-- Card content -->
            <div class="card-body hidden" id="${this.id}-collapse">
            <div class="collapse-content">
                <hr />

                <p class="card-text collapse" style="height:auto ">${this.description}</p>
                <hr />
            </div>

            <div style="display: flex; justify-content: space-between; width: 100%;">
                ${this.finished ? `<a
                class="btn-floating btn-lg yellow darken-2 revert-button"
                ><i class="fa fa-undo"></i></a
                >` : `<a class="btn-floating btn-lg green finish-button"
                ><i class="fa fa-check"></i></a
                >`}

                <a class="btn-floating btn-lg red remove-button"
                ><i class="fa fa-times"></i
                ></a>
            </div>
            </div>
            </div>

        
        
        `;
    }

}
app.initialize();

function attachEvents() {
    $(".remove-button").click(function (e) {
        list.remove($(e.currentTarget).closest(".toDoListItem"));
    });
    
    $(".revert-button").click(function (e) {
        list.revert($(e.currentTarget).closest(".toDoListItem"));
    });
    
    $(".finish-button").click(function (e) {
        list.finish($(e.currentTarget).closest(".toDoListItem"));
    });
}

$(document).ready(function() {
    $('input#input_text, textarea#textarea1').characterCounter();
});