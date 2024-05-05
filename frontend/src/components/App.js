import React, { useEffect, useState, useCallback } from 'react';
import { Route, Switch, withRouter, useHistory } from 'react-router-dom';

import Main from './Main';
import Footer from './Footer';
import ProtectedRoute from './ProtectedRoute';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import InfoToolTip from './InfoToolTip';
import Login from './Login';
import Register from './Register';
import api from '../utils/api';
import * as auth from '../utils/auth';

import { UserContext } from '../contexts/CurrentUserContext';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCardToDelete, setSelectedCardToDelete] = useState('');
  const [selectedCard, setSelectedCard] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInfoToolOpen, setIsInfoToolOpen] = useState(false);
  const [popupType, setPopupType] = useState(false);
  const [cardsApp, setCards] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  const [currentUser, setCurrentUser] = useState({
    name: '',
    about: '',
    avatar: '',
  });

  let history = useHistory();

  const EnableEsc = () => {
    const escFunction = useCallback((event) => {
      if (event.key === 'Escape') {
        closeAllPopups();
      }
    }, []);

    useEffect(() => {
      document.addEventListener('keydown', escFunction, false);

      return () => {
        document.removeEventListener('keydown', escFunction, false);
      };
    }, [escFunction]);
  };
  EnableEsc();

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleConfirmDeleteClick(cardId) {
    setSelectedCardToDelete(cardId);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser({ name, about }) {
    api.editUserInfo(name, about).then(setCurrentUser).then(closeAllPopups);
  }

  function handleUpdateAvatar(avatar) {
    api.editAvatar(avatar).then(setCurrentUser).then(closeAllPopups);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.includes(currentUser._id);

    api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    });
  }

  function handleCardDelete(cardId) {
    api.removeCard(cardId).then(() => {
      setCards(cardsApp.filter((card) => card._id !== cardId));
      setSelectedCardToDelete('');
    });
  }

  function handleAddPlaceSubmit(name, link) {
    api
      .addCard(name, link)
      .then((newCard) => setCards([newCard, ...cardsApp]))
      .then(closeAllPopups);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCardToDelete('');
    setSelectedCard({});
    setIsInfoToolOpen(false);
  }

  function handleRegister(success) {
    setIsInfoToolOpen(true);
    setPopupType(success);
  }

  const handleRegisterError = (fail) => {
    setIsInfoToolOpen(true);
    setPopupType(fail);
  };

  function handleClose() {
    if (popupType === 'success') {
      setIsInfoToolOpen(false);
      history.push('/login');
    } else {
      setIsInfoToolOpen(false);
    }
  }

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    history.push('/login');
  }

  // const [cardsLoaded, setCardsLoaded] = useState(false);
  // useEffect(() => {
  //   if (isLoggedIn && !cardsLoaded) {
  //     api
  //       .getInitialCards()
  //       .then((cardsResponse) => {
  //         if (cardsResponse.data) {
  //           setCards(cardsResponse.data);
  //           setCardsLoaded(true); // Atualiza o estado para indicar que os cartões foram carregados
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Erro ao obter os cartões:', error);
  //       });
  //   }
  // }, [isLoggedIn, cardsLoaded]);

  // useEffect(() => {
  //   api
  //     .getUserInfo(token)
  //     .then((res) => {
  //       setCurrentUser(res.data);
  //       api
  //         .getInitialCards(token)
  //         .then((res) => {
  //           if (res.data) {
  //             setCards((cards) => res.data);
  //             // setCards((cards) => [...cards, res.data]);
  //           }
  //         })
  //         .catch((err) => console.log(err));
  //     })
  //     .catch((err) => console.log(err));
  // }, [token]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            console.log(res);
            setIsLoggedIn(true);
            setCurrentUser(res.data);
            history.push('/');
            setUserEmail(res.data.email);

            // if (currentUser) {
            //   api.getUserInfo(token).then((res) => {
            //     setCurrentUser(() => res.data);
            //   });
            //   api.getInitialCards(token).then((res) => {
            //     console.log(res);
            //     setCards(() => res.data);
            //   });
            // }
          }
        })
        // .then(() => {
        //   if (isLoggedIn) {
        //     api.getUserInfo(token).then((res) => {
        //       setCurrentUser(() => res.data);
        //     });
        //     api.getInitialCards(token).then((res) => {
        //       console.log(res);
        //       setCards(() => res.data);
        //     });
        //   }
        // })

        .catch((err) => {
          console.log(err);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    isLoggedIn &&
      api.getInitialCards(token).then((res) => {
        if (res.data) {
          setCards(() => res.data);
        }
      });
  }, [isLoggedIn]);
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   isLoggedIn &&
  //     api
  //       .getUserInfo(token)
  //       .then((res) => {
  //         setCurrentUser(res.data);
  //       })
  //       .then(
  //         api.getInitialCards(token).then((res) => {
  //           if (res.data) {
  //             setCards(() => res.data);
  //           }
  //         })
  //       )
  //       .catch((err) => console.log(err));
  // }, [isLoggedIn]);
  // useEffect(() => {
  //   if (token) {
  //     auth
  //       .checkToken(token)
  //       .then(
  //         api.getUserInfo().then((res) => {
  //           setCurrentUser(res.data);
  //           api
  //             .getInitialCards()
  //             .then((res) => {
  //               if (res.data) {
  //                 setCards(() => res.data);
  //               }
  //             })
  //             .catch((err) => console.log(err));
  //         })
  //       )
  //       .catch((err) => console.log(err));
  //   }
  // }, []);

  return (
    <div className='App'>
      <div className='page'>
        <UserContext.Provider value={currentUser}>
          <Switch>
            <Route path='/register'>
              <Register
                handleRegister={handleRegister}
                handleRegisterError={handleRegisterError}
              />
              <InfoToolTip
                isOpen={isInfoToolOpen}
                popupType={popupType}
                handleClose={handleClose}
              />
            </Route>
            <Route path='/login'>
              <Login
                handleLogin={handleLogin}
                handleRegisterError={handleRegisterError}
              />
            </Route>
            <Route path='/'>
              <ProtectedRoute
                exact
                path='/'
                isLoggedIn={isLoggedIn}
                component={
                  <Main
                    onEditProfileClick={handleEditProfileClick}
                    onEditAvatarClick={handleEditAvatarClick}
                    onAddPlaceClick={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onConfirmClick={handleConfirmDeleteClick}
                    cardsApp={cardsApp}
                    handleLogout={handleLogout}
                    userEmail={userEmail}
                  ></Main>
                }
              />
              <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
              />
              <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddPlaceSubmit={handleAddPlaceSubmit}
              />

              <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
              />
              <ConfirmDeletePopup
                cardId={selectedCardToDelete}
                onClose={closeAllPopups}
                onCardDelete={handleCardDelete}
              />
              <ImagePopup card={selectedCard} onClose={closeAllPopups} />
            </Route>
          </Switch>
          <Footer />
        </UserContext.Provider>
      </div>
    </div>
  );
}

export default withRouter(App);