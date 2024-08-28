import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus , faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactTable = () => {
  const [contacts, setContacts] = useState([]);
  const [sortedContacts, setSortedContacts] = useState([]);
  const [sortColumn, setSortColumn] = useState(null); // Colonne par défaut
  const [sortDirection, setSortDirection] = useState('asc'); // Direction par défaut

  // États pour la gestion de la modification et de l'ajout
  const [editingContact, setEditingContact] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [editedAge, setEditedAge] = useState('');
  const [editedCountry, setEditedCountry] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');

  const [addFirstName, setAddFirstName] = useState('');
  const [addLastName, setAddLastName] = useState('');
  const [addAge, setAddAge] = useState('');
  const [addCountry, setAddCountry] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');

  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isAgeValid, setIsAgeValid] = useState(true);
  const [isCountryValid, setIsCountryValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const sorted = [...contacts].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedContacts(sorted);
  }, [contacts, sortColumn, sortDirection]);

  const filteredContacts = sortedContacts.filter(contact => 
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.age.toString().includes(searchTerm) ||
    contact.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  

  const handleEdit = (id) => {
    const contactToEdit = contacts.find(contact => contact.id === id);

    setEditingContact(contactToEdit);
    setEditedFirstName(contactToEdit.firstName);
    setEditedLastName(contactToEdit.lastName);
    setEditedAge(contactToEdit.age);
    setEditedCountry(contactToEdit.country);
    setEditedEmail(contactToEdit.email);
    setEditedPhone(contactToEdit.phone);
    setShowModal(true);
  };

  const handleDelete = async (contactId) => {
    // Afficher la boîte de dialogue de confirmation
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas récupérer ce contact une fois supprimé!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });
  
    // Si l'utilisateur confirme la suppression
    if (result.isConfirmed) {
      try {
        // Envoyer la requête de suppression
        await fetch(`http://localhost:8000/contacts/${contactId}`, {
          method: 'DELETE',
        });
  
        // Afficher le message de succès
        Swal.fire({
          title: 'Supprimé!',
          text: 'Le contact a été supprimé avec succès.',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
        });
  
        // Rafraîchir la liste des contacts
        fetchContacts();
      } catch (error) {
        // Afficher le message d'erreur en cas de problème
        Swal.fire({
          title: 'Erreur!',
          text: 'Une erreur s\'est produite lors de la suppression du contact.',
          icon: 'error',
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };
  
  

  const handleAdd = () => {
    setShowAddModal(true);
    setAddFirstName('');
    setAddLastName('');
    setAddAge('');
    setAddCountry('');
    setAddEmail('');
    setAddPhone('');
  };


  const handleSaveEdit = async (id) => {
    const contactData = {
      firstName: editedFirstName,
      lastName: editedLastName,
      age: editedAge,
      country: editedCountry,
      email: editedEmail,
      phone: editedPhone,
    };
  
    try {
      const response = await axios.put(`http://localhost:8000/contacts/${id}/edit`, contactData);
  
      if (response.status === 200) {
        Swal.fire({
          title: 'Succès!',
          text: 'La modification a été effectuée avec succès',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
        });
  
        // Rafraîchir la liste des contacts depuis le serveur
        fetchContacts();
  
        setEditingContact(null);
        setEditedFirstName('');
        setEditedLastName('');
        setEditedAge('');
        setEditedCountry('');
        setEditedEmail('');
        setEditedPhone('');
        setShowModal(false);
      } else {
        toast.error('Échec de la mise à jour du contact :', response.data.message);
      }
    } catch (error) {
      toast.error('Une erreur s\'est produite lors de la mise à jour du contact :', error);
    }
  };
  

  const handleCloseModal = () => {
    setEditingContact(null);
    setEditedFirstName('');
    setEditedLastName('');
    setEditedAge('');
    setEditedCountry('');
    setEditedEmail('');
    setEditedPhone('');
    setShowModal(false);
  };

  const validateFirstName = (firstName) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(firstName);
  };

  const validateLastName = (lastName) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(lastName);
  };

  const validateAge = (age) => {
    return Number.isInteger(parseInt(age)) && parseInt(age) > 0;
  };

  const validateCountry = (country) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(country);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^\+?\d{10,15}$/;
    return regex.test(phone);
  };

  const handleFirstNameChange = (value) => {
    setEditedFirstName(value);
    setIsFirstNameValid(validateFirstName(value));
  };

  const handleLastNameChange = (value) => {
    setEditedLastName(value);
    setIsLastNameValid(validateLastName(value));
  };

  const handleAgeChange = (value) => {
    setEditedAge(value);
    setIsAgeValid(validateAge(value));
  };

  const handleCountryChange = (value) => {
    setEditedCountry(value);
    setIsCountryValid(validateCountry(value));
  };

  const handleEmailChange = (value) => {
    setEditedEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handlePhoneChange = (value) => {
    setEditedPhone(value);
    setIsPhoneValid(validatePhone(value));
  };

  const handleAddFirstNameChange = (value) => {
    setAddFirstName(value);
    setIsFirstNameValid(validateFirstName(value));
  };

  const handleAddLastNameChange = (value) => {
    setAddLastName(value);
    setIsLastNameValid(validateLastName(value));
  };

  const handleAddAgeChange = (value) => {
    setAddAge(value);
    setIsAgeValid(validateAge(value));
  };

  const handleAddCountryChange = (value) => {
    setAddCountry(value);
    setIsCountryValid(validateCountry(value));
  };

  const handleAddEmailChange = (value) => {
    setAddEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handleAddPhoneChange = (value) => {
    setAddPhone(value);
    setIsPhoneValid(validatePhone(value));
  };

  const handleSaveContact = async () => {
    const contactData = {
      firstName: addFirstName,
      lastName: addLastName,
      age: addAge,
      country: addCountry,
      email: addEmail,
      phone: addPhone,
    };
  
    try {
      const response = await axios.post('http://localhost:8000/contacts/new', contactData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 201) {
        Swal.fire({
          title: 'Succès!',
          text: 'Le contact a été ajouté avec succès',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
        });
  
        fetchContacts();
  
        setAddFirstName('');
        setAddLastName('');
        setAddAge('');
        setAddCountry('');
        setAddEmail('');
        setAddPhone('');
        setShowAddModal(false);
      } else {
        toast.error('Échec de l\'ajout du contact :', response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Une erreur s\'est produite lors de l\'ajout du contact.');
      }
    }
  };
  

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/contacts');
      if (response.status === 200) {
        setContacts(response.data.contacts);
      } else {
        toast.error('Erreur lors du chargement des contacts :', response.data.message);
      }
    } catch (error) {
      toast.error('Une erreur s\'est produite lors du chargement des contacts :', error);
    }
  };

  const handleSort = (column) => {
    setSortDirection(sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc');
    setSortColumn(column);
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return faSort; // Default sort icon
    }
    return sortDirection === 'asc' ? faSortUp : faSortDown;
  };

  

  return (
    <div className='Contacts-Table'>
      <h1 className="text-center">Gestion des Contacts</h1>
      <Form>
        <Row className="align-items-center">
          <Col xs={12} md={6}>
            <Form.Control
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-50"
            />
          </Col>
          <Col xs={12} md={6} className="d-flex justify-content-end">
            <Button variant="success" onClick={handleAdd} className="ml-2">
              <FontAwesomeIcon icon={faPlus} /> Ajouter
            </Button>
          </Col>
        </Row>
      </Form>


      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th onClick={() => handleSort('lastName')}>
              Nom 
              <FontAwesomeIcon icon={getSortIcon('lastName')} className="sort-icon" />
            </th>
            <th onClick={() => handleSort('firstName')}>
              Prénom 
              <FontAwesomeIcon icon={getSortIcon('firstName')} className="sort-icon" />
            </th>
            <th onClick={() => handleSort('age')}>
              Âge 
              <FontAwesomeIcon icon={getSortIcon('age')} className="sort-icon" />
            </th>
            <th onClick={() => handleSort('country')}>
              Pays 
              <FontAwesomeIcon icon={getSortIcon('country')} className="sort-icon" />
            </th>
            <th onClick={() => handleSort('email')}>
              Email 
              <FontAwesomeIcon icon={getSortIcon('email')} className="sort-icon" />
            </th>
            <th onClick={() => handleSort('phone')}>
              Téléphone 
              <FontAwesomeIcon icon={getSortIcon('phone')} className="sort-icon" />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <tr key={contact.id}>
                <td>{contact.lastName}</td>
                <td>{contact.firstName}</td>
                <td>{contact.age}</td>
                <td>{contact.country}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>
                  <div className="button-group">
                    <Button variant="warning" onClick={() => handleEdit(contact.id)}>
                      <FontAwesomeIcon icon={faEdit} /> Modifier
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(contact.id)}>
                      <FontAwesomeIcon icon={faTrash} /> Supprimer
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="empty-table-message">Aucun contact disponible</td>
            </tr>
          )}
        </tbody>
      </Table>


      {/* Modal pour la modification */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Prénom :</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedFirstName}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                    isInvalid={!isFirstNameValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Le prénom est invalide.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nom :</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedLastName}
                    onChange={(e) => handleLastNameChange(e.target.value)}
                    isInvalid={!isLastNameValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Le nom est invalide.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Âge :</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedAge}
                    onChange={(e) => handleAgeChange(e.target.value)}
                    isInvalid={!isAgeValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    L'âge est invalide.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Pays :</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    isInvalid={!isCountryValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Le pays est invalide.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email :</Form.Label>
                  <Form.Control
                    type="email"
                    value={editedEmail}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    isInvalid={!isEmailValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    L'email est invalide.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Téléphone :</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    isInvalid={!isPhoneValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Le numéro de téléphone est invalide.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSaveEdit(editingContact.id)}
            disabled={!isFirstNameValid || !isLastNameValid || !isAgeValid || !isCountryValid || !isEmailValid || !isPhoneValid}
          >
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Modal pour l'ajout */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Prénom :</Form.Label>
                  <Form.Control
                    type="text"
                    value={addFirstName}
                    onChange={(e) => handleAddFirstNameChange(e.target.value)}
                    isInvalid={!isFirstNameValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Le prénom est invalide.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nom :</Form.Label>
                  <Form.Control
                    type="text"
                    value={addLastName}
                    onChange={(e) => handleAddLastNameChange(e.target.value)}
                    isInvalid={!isLastNameValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Le nom est invalide.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Âge :</Form.Label>
                  <Form.Control
                    type="text"
                    value={addAge}
                    onChange={(e) => handleAddAgeChange(e.target.value)}
                    isInvalid={!isAgeValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    L'âge est invalide.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Pays :</Form.Label>
                  <Form.Control
                    type="text"
                    value={addCountry}
                    onChange={(e) => handleAddCountryChange(e.target.value)}
                    isInvalid={!isCountryValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Le pays est invalide.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email :</Form.Label>
                  <Form.Control
                    type="email"
                    value={addEmail}
                    onChange={(e) => handleAddEmailChange(e.target.value)}
                    isInvalid={!isEmailValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    L'email est invalide.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Téléphone :</Form.Label>
                  <Form.Control
                    type="text"
                    value={addPhone}
                    onChange={(e) => handleAddPhoneChange(e.target.value)}
                    isInvalid={!isPhoneValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Le numéro de téléphone est invalide.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveContact}
            disabled={!isFirstNameValid || !isLastNameValid || !isAgeValid || !isCountryValid || !isEmailValid || !isPhoneValid}
          >
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContactTable;
