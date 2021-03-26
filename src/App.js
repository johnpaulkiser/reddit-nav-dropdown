import React, {useState, useRef, useEffect} from 'react';

import fromServer from './initialState.js'


function App() {
  const [query, setQuery] = useState('');
  const [communities, setCommunities] = useState(fromServer.communities);
  const [title, setTitle] = useState(fromServer.feeds[0].name);
  const [icon, setIcon] = useState(fromServer.feeds[0].icon);


  function updateCommunities(communityName, isFavorite){
    const index = communities.map(e => e.name).indexOf(communityName);
    const newFavs = [...communities];
    newFavs[index].isFavorite = !isFavorite;
    setCommunities(newFavs);
  }
  function changePage(title, icon){
    setTitle(title);
    setIcon(icon);
  }

  const titleBar = <TitleBar icon={icon} title={title} />

  return (
    <div className="w-64">
      <DropDown titleBar={titleBar}>
        <FilterBar handleFilter={setQuery}/> 
        <FilterableList title="REDDIT FEEDS" query={query}>
          {fromServer.feeds.map((item, index) => {
            return <MenuItem 
                      key={index} 
                      title={item.name} 
                      icon={item.icon} 
                      clickHandler={changePage}/>
          })}
        </FilterableList>
        <FilterableList title="FAVORITES" query={query}>
          {communities.map((item, index) => {
            if(item.isFavorite)
              return <SubredditMenuItem 
                        key={index} 
                        title={item.name} 
                        icon={item.icon} 
                        isFavorite={item.isFavorite}
                        clickHandler={changePage}
                        favoriteHandler={updateCommunities}/>;
            else 
              return null;
                    
          })}
        </FilterableList>
        <FilterableList title="MY COMMUNITIES" query={query}>
          {fromServer.communities.map((item, index) => {
            return <SubredditMenuItem 
                      key={index} 
                      title={item.name} 
                      icon={item.icon} 
                      isFavorite={item.isFavorite}
                      alwaysShow={true}
                      clickHandler={changePage}
                      favoriteHandler={updateCommunities}/>;
          })}
        </FilterableList>
        <FilterableList title="OTHER" query={query}>
          {fromServer.other.map((item, index) => {
            return <MenuItem 
                      key={index} 
                      title={item.name} 
                      icon={item.icon} 
                      clickHandler={changePage}/>
          })}
        </FilterableList>
      </DropDown>
    </div>
  );
}

function DropDown({children, titleBar}){
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="rounded border border-gray-100 hover:border-gray-200">
      <div className="cursor-pointer" onClick={toggleMenu}>
        {titleBar}
      </div>
      {isOpen &&
      <div className="max-h-96 overflow-auto overscroll-contain">
       {children}
      </div>
      }
    </div>
  )

}


function TitleBar({icon, title}){
  // Title bar shows selected page
  return (
      <div className="flex content-center justify-between py-2 px-3">
        {/* Left aligned */}
        <div className="flex content-center">
          <img className="h-6 w-6 text-blue-600" src={icon} alt="icon" />
          <h1 className="ml-2">{title}</h1>
        </div>

        {/* Right aligned */}
        <div className="flex mt-1 text-gray-400">
          <svg  className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
    </div>
  );
}


function FilterBar({handleFilter}) {
  const userInput = useRef(null);

  function handleChange(){
    handleFilter(userInput.current.value.toLowerCase()); 
  }

  return (
    <div className="px-3 pt-1 pb-3">

      <input 
        className="w-full p-1 h-8 border focus:outline-none focus:ring-1 focus:border-blue-300" 
        type="input" 
        autoFocus={true}
        placeholder="Filter"
        onChange={handleChange} 
        ref={userInput} 
      />
    </div>
  );
}

function FilterableList({children, title, query}){
  const [filtered, setFiltered] = useState([]);

  function applyFilter(){
    setFiltered(
      React.Children.toArray(children).filter((child) => {
        return (child.props.title.toLowerCase().includes(query));
      })
    );
  }

  // call this every time the query changes.
  useEffect(applyFilter, [children, query]);

  return (
    <div className="flex-col">
      {/* only show title is there are items in the list */}
      { filtered.length !== 0 && 
        <p className="px-5 py-2 font-bold text-gray-400 text-tiny">{title}</p>
      }  
      <div>{filtered}</div>
    </div>
  );
}


function MenuItem({title, icon, clickHandler}){
  function handleClick(){
    clickHandler(title, icon);
  }
  return (
    <div className="flex hover:bg-gray-100 cursor-pointer" onClick={handleClick}>
      <div className="flex content-center w-full pl-5 py-2">
        <img className="h-5 w-5 text-blue-600" src={icon} alt="icon"></img>
        <h1 className="ml-2 font-light text-sm">{title}</h1>
      </div>
    </div>
  )
}
function SubredditMenuItem({title, icon, clickHandler, isFavorite=true, favoriteHandler}){

  function handleClick(e){
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    e.preventDefault();
    clickHandler(title, icon);
  }

  function handleFavorite(e){
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    e.preventDefault();
    favoriteHandler(title, isFavorite);
  }
  
  return (
    <div className="flex hover:bg-gray-100 cursor-pointer" onClick={handleClick}>
      <div className="flex content-center justify-between w-full pl-5 py-2">
        <div className="flex">
          <img className="h-5 w-5 text-blue-600" src={icon} alt="icon"></img>
          <h1 className="ml-2 font-light text-sm">{title}</h1>
        </div>
        <div className="mr-5">
          <div className={isFavorite ? 'text-blue-600' :  'text-gray-400'} onClick={handleFavorite}>
            <svg className="w-5 h-5 fill-current"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}



export default App;
