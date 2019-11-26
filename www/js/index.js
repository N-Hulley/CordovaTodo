/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        let items = [
            new ToDoListItem("Go Shopping", "amco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in repreh"),
            new ToDoListItem("Pick up the kids", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ei"),
            new ToDoListItem("Go Shopping", " cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum")
        ];
        
        
        
        let list = new ToDoList(items);
        $(".toDoListItems").html(list.getHTML());
        $(".list-item .btn-danger").click(function(e) {
            $(`#item-${(e.currentTarget.id)}`).remove();
        });
        
        console.log(list);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
    
};


class ToDoList {
    constructor(items) {
        this.items = items;
    }
    
    getHTML() {
        let rows = ``;
        for (let i = 0; i < this.items.length; i++) {
            rows += this.items[i].getHTML();
        }

        return `
        <div class="card mb-5">
            <div class="card-body">
                <table class="table table-responsive-md">
                    <thead>
                        <tr>
                        <th>
                            <strong>Title</strong>
                        </th>            
                        <th>
                            <strong>Description</strong>
                        </th>     
                        <th>
                            <strong>Actions</strong>
                        </th>     
                    </thead>    
                    <tbody>
                        ${rows}
                    </tbody
                </table>
            </div>
        </div>`;
    }
}
var listId = 0;
class ToDoListItem {
    constructor(title, description) {
        this.title = title;
        this.description = description;
        this.id = listId++;
    }
    getHTML() {
        return `
            <tr class="list-item" id="item-${this.id}">
                <th scope="row" >${this.title}</th>
                <td>${this.description}</td>
                <td><button class="btn btn-small btn-primary">Edit</button><button class="btn btn-small btn-danger" id="${this.id}">Remove</button></td>
            </tr>`;
    }
    remove() {
        $(`#item-${this.id}`).remove();
    }
    
}


app.initialize();