import React from 'react';
import MaterialTable from 'material-table';
import Axios from 'axios'


import ModalPlantEthnic from './ModalPlantEthnic';
import Spinner from './Spinner'
import SnackBar from './SnackBar'

class TabelPlantEthnic extends React.Component{
  constructor(props) {
    super(props);
    this.state =  {
      loading: false,
      columns: [
        { title: 'Ethnic', field: 'ethnic' },
        { title: 'Disease in Bahasa', field: 'disease_ina' },
        { title: 'Disease in English', field: 'disease_ing' },
        { title: 'Name Plant in Bahasa', field: 'name_ina' },
        { title: 'Species', field: 'species' },
        { title: 'Family', field: 'family' },
        { title: 'Use Section in Bahasa', field: 'section_ina' },
        { title: 'Use Section in English', field: 'section_ing' },
      ],
      data: [],
      modal: {
        open: false,
        mode: '',
      },
      snackbar: {
        open: false,
        success: false,
        message: '',
      },
      onSelect: null
    }
    this.closeBtn = this.closeBtn.bind(this);
    this.afterUpdate = this.afterUpdate.bind(this);
    this.getData = this.getData.bind(this);
  }

  
  async componentDidMount() {
    // window.addEventListener('scroll', this.onScroll);
    this.setState({
      loading: true
    })
    await this.getData();
  }

  async getData(){
    const url = '/jamu/api/plantethnic/';
    const res = await Axios.get(url);
    const { data } = await res;
    this.setState({
      data: data.data, 
      loading: false
    })
  }

  closeBtn() {
    this.setState({
      onSelect: null,
      modal: {
        open: false,
        mode: ''
      },
      snackbar: {
        open: false,
        success: false,
        message: '',
      }
    })
  }

  async afterUpdate (success, message){
    this.getData();
    this.setState({
      modal: {
        open: false,
        mode: '',
      },
      snackbar: {
        open: true,
        success: success,
        message: message,
      }
    })
  }

  render(){
    return (
      <div>
      {this.state.loading ? <Spinner />
        :
      <MaterialTable
        title="Plant Ethnic Management Table"
        columns={this.state.columns}
        data={this.state.data}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Save Company',
            onClick: (event, rowData) => {
              this.setState({
                onSelect: rowData,
                modal: {
                  open: true,
                  mode: 'update'
                }
              })
            }
          },{
            icon: 'delete',
            tooltip: 'Delete Company',
            onClick: (event, rowData) => {
              this.setState({
                onSelect: rowData,
                modal: {
                  open: true,
                  mode: 'delete'
                }
              })
            }
          },
          {
            icon: 'add',
            tooltip: 'Add Company',
            isFreeAction: true,
            onClick: (event, rowData) => {
              this.setState({
                modal: {
                  open: true,
                  mode: 'add'
                }
              })
            }
          }
        ]}
        options={{
          actionsColumnIndex: -1
        }}
      />
      }
      {this.state.modal.open === true ? <ModalPlantEthnic data={this.state.onSelect} afterUpdate={this.afterUpdate} modal={this.state.modal} close={this.closeBtn}/>
      : 
      null
      }

      {this.state.snackbar.open === true ? <SnackBar data={this.state.snackbar} close={this.closeBtn}/>
      : 
      null
      } 
      </div> 
    );
  }
}

export default TabelPlantEthnic;