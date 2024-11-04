<div align="center">
<h3 align="center">Homepage Plus</h3>

  <p align="center">
    A user based customizable homepage
    <br />
    <a href="https://github.com/Astralye/Homepage-Plus"><strong>Explore the docs»</strong></a>
    <br />
    <br />
    <a href="https://astralye.github.io/Homepage-Plus/">View Demo</a>
    .
    <a href="https://github.com/Astralye/Homepage-Plus/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/Astralye/Homepage-Plus/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About the Project

The internet is unfathomably huge. However, It can be hard to keep track of important websites needed as well as all useful and relevant pages we might need. The idea came from a disorganised bookmarks and also non-customizable homepages that search engines use. In Firefox and Chrome (others I haven't confirmed) you are able to set a website to a homepage. However, I cannot seem to find any extensions or websites that can help personalize and organize internet usage.

The reasoning behind this project is more personal than anything. I find that it is tedious having to scour the internet for certain things and then get sub-par results. Having the user be able to create and organize their own personal 'page' to then surf the internet will help me (and perhaps others), to have a more streamlined internet usage.

The main goal of this is to push users to create and customize a personal home-page for their internet usage. Therefore, the point of this is to help organize and as such, is a productivity tool.

I have discussed this idea with others, and they have agreed with its potential usefulness. However, whether it is just me, the creator, who would actually find this useful, or other power users who would find benefit, I am unsure of the widespread appeal of this app. 

As such, this project has a specific audience. Those who use the internet fairly often (outside of social media), and would like to organize browser and internet surfing. Although this idea may be widely spread, the implementation of setting up and using local webpages rather than a dedicated app would most likely cause non-programmer or technical users to not use this application. Since this is a personal project, I would not expect this to grow large enough for this to be a problem.

## Built with

* [![Vue][Vue.js]][Vue-url]
* 

[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/

## Getting Started

### Prerequisites
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/Astralye/Homepage-Plus.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin Astralye/Homepage-Plus
   git remote -v # confirm the changes
   ```

## Usage
### Initial start
The website will be empty, only containing the two buttons, Edit and Settings at the top right.

Click the Edit, to open the Editing window.
### Edit
The edit window will toggle the edit mode. In this mode, icon links will not fire, and can be dragged. You will be able to save, delete and cancel any changes.

The edit window will contain 4 different options:
- Layout
- Containers
- Widgets
- Link Maker

Layout is used for subdividing the page.
Containers modify how each subdivision displays the content.
Widgets has not been implemented but kept in.
Link Maker is used for creating and modifying icons and links
### Layout
Subdivisions divide the page up by creating more containers, these containers are therefore recursive, allowing you to add as many as you will like. However, going beyond 3 or 4 nests depending on screen size, can cause bugs.

To select a container, click the 'Select Container' button.

Because the nature of the containers, the division type **only** affect the children. If you wish to modify the main page, you must click the container surrounding the edges.

**Division type** modifies how the child containers will be split up. E.g Vertical means that it will form vertical columns, and horizontal will form horizontal rows. 

**No. Container Division** modifies how many children the container will have.
**Note**: I have limited this to a max of four, due to the nature of nesting and screensize.

### Containers
Similar to Layout, you can select a container to modify. This does, modify the selected container and not affect the children.

**Container Name** is currently nonfunctional, and was left within.
**Display Type** refers to how the web links are displayed on the page. Grid only works.

The content past **Display type** should only correspond to the selected input, like a tab. Currently not implemented, and only have grids.

**Grid Content Align** changes how the icons in the grid to be rendered:
- Compact, all icons should bundle at the specified direction, Default, Top Left.
- Free, Icons can be placed anywhere in the container

**Note:** Icon positions in Free align, are absolute. If screen size changes (Mainly smaller), it will not display the icons, because the coordinate is not present on screen.

**Container Dimensions** modifies Direction of compact alignment. This should only display on compact align.

### Link Maker
The link maker is used to create, modify and delete icons and links.

By default, there should be no saved icons.

To create a new icon, click 'New'.
To delete an icon, select the icon to be deleted, and click 'delete'.

A selected icon will have a highlighted border.
Modification of icons require an icon to be selected.

#### Customize
To change icon, click on the large icon in the **Displayed icon** box.
This will open a menu of static svg data.
The selected icon will be highlighted.
Click on a new icon to change it.

You are also able to change the colour of an svg icon. Click the pallet at the bottom right of the icon to open a colour picker window.

To modify the colours, you have three options:
1. Slide and drag the Hue, Saturation, and Light values.
2. Paste Hex data
3. Paste HSL data

To save the colour, click the **save colour** button.
**Note:** This saves the colour to the icon. This does not save any changes in page data.

Below the calculated colour, is the last 10 saved colours. Click to retrieve the colour data. Saving the same colour does not add to the saved colour list.

**Name** is the displayed text below the icon. This can be disabled via the checkbox.
**Icon size** changes the size of the icon in the menu, in px.

#### Function
You can set the link via:
1. Automatic parsing
2. Manual parsing

Copy and paste the URL into the text box.
This will fill out the hostname and subdirectory.

**Note:** Subdirectory does not include any search query data.

You can manually parse the URL via hostname and subdirectory.

**New window** toggle does not function, and will always open a new window.
To save the link to the icon, click the 'Save' button at the bottom right.

### Exiting Edit mode
Closing the edit window or clicking the edit button causes it to toggle off the edit mode. This does not save any changes (A warning should be here in the future), if you decide to leave or refresh the page. 

To use the link, just double click the icon, and it will open a new tab to the selected page.

### Misc
If you use website that require an account to use, you will need to be logged in, such that the page will be able to load.

This page stores data using localstorage. Therefore, the page is only local to the specific browser used to save on. 

A feature to export and import the data will be considered in the future.

## Screenshots
![[Base.png]]
![[Link maker.png]]

## License
This project is licensed under the GNU General Public License v3.0. See the [License](LICENSE.md) file for details.

