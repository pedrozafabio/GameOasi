import React, { Component } from "react";
import styles from "./EditAvatar.module.css";
import Button from "./Button";
import Item from "./Item";
import Button2 from "./Button2";
import {
  MdBrightnessHigh,
  MdCheckCircle,
  MdArrowBack,
  MdArrowForward,
  MdKeyboardBackspace,
  MdTagFaces,
  MdAccessibility,
  MdColorLens,
  MdTexture,
  MdStraighten,
} from "react-icons/md";
import ponchoIcon from "../../assets/icons/poncho.svg";

import ItemList from "./ItemList";
import items, {
  PONCHO_SIZE,
  HEAD_COLOR,
  HEAD,
  BODY_COLOR,
  PONCHO_TEXTURE,
} from "./items";
import { connect } from "react-redux";
import { GetCharacter } from "../../store/actions/characters";
import { updateCharacter } from "../../store/actions/auth";

class EditAvatar extends Component {
  state = {
    buttonSelected: PONCHO_SIZE,
    itemSelected: -1,
    data: [...items.ponchoSize],
    characterOutfit: [1, 0, 2, 0, 2],
    visible: false,
  };

  componentDidMount() {
    console.log(this.props);

    let outfit = [
      this.props.character.headTexture.textureId,
      this.props.character.ponchoSize.sizeId,
      this.props.character.ponchoTexture.textureId,
      this.props.character.headColor.colorId,
      this.props.character.bodyColor.colorId,
    ];
    window.setEditAvatar = this.setHUDVisible;
    this.setState({ 
      characterOutfit: outfit,
      itemSelected: this.state.characterOutfit[PONCHO_SIZE],
    });
  }

  getData = () => {
    let outfit = [...this.state.characterOutfit];
    console.log( items.ponchoSize[outfit[PONCHO_SIZE]].id);
    let data = {
      "ponchoSize": items.ponchoSize[outfit[PONCHO_SIZE]].id,
      "headTexture":  items.head[outfit[HEAD]].id,
      "ponchoTexture": items.ponchos[outfit[PONCHO_TEXTURE]].id ,
      "bodyColor":  items.bodyColor[outfit[BODY_COLOR]].id,
      "headColor": items.headColor[outfit[HEAD_COLOR]].id,
    };
    console.log( data);
            return data; 


  }

  setHUDVisible = (visible) => {
    this.setState({ visible: visible });
  };

  setCharacterOutfit() {}

  test(e) {
    console.log("sadasdsa");
  }

  render() {
    return this.state.visible ? (
      <div className={styles.Container}>
        <div className={styles.controlsContainer}>
          <div className={styles.controls}>
            <Button2
              onClick={() => {
                window.character.rotate(-0.5);
              }}
            >
              {" "}
              <MdArrowBack style={{ padding: "10px" }} />{" "}
            </Button2>
            <Button2
              onClick={() => {
                window.character.rotate(0.5);
              }}
            >
              {" "}
              <MdArrowForward style={{ padding: "10px" }} />{" "}
            </Button2>
          </div>
        </div>
        <div className={styles.test}>
          <div className={styles.titleContainer}>
            <Button2
              onClick={() => {
                if(!this.props.loadingUpdate)
                  window.changeScene({ Type: "Map" }, []);
              }}
              noborder
              style={{
                padding: "10px",
                backgroundColor: "rgba(234,94,191)",
                backgroundImage: undefined,
              }}
            >
              {" "}
              <MdArrowBack style={{ paddingRight: "10px" }} /> VOLTAR{" "}
            </Button2>
            <div className={styles["apply-container"]}>
              <div className={styles.title}>EDITAR AVATAR</div>
              <Button2
                style={{ padding: "10px" }}
                onClick={() => {
                  if(!this.props.loadingUpdate){
                    this.props.updateCharacter(
                      this.props.character._id,
                        this.getData(),
                        localStorage.getItem("token") ?? "NOTOKEN"
                    );
                  }                 
                }}
              >
                {" "}
                <MdCheckCircle style={{ paddingRight: "10px" }} /> {this.props.loadingUpdate? "APLICANDO..." :"APLICAR"}
              </Button2>
            </div>
          </div>
          <div className={styles.menuContainer}>
            <div className={styles.menuContainerChildren}>
              <div className={styles.buttonMenu}>
                <Button
                  color="rgba(64,64,64)"
                  colorSelected="rgba(29,29,29)"
                  id={PONCHO_SIZE}
                  icon={<MdStraighten />}
                  selected={this.state.buttonSelected}
                  onClick={(e) => {
                    this.setState({
                      buttonSelected: PONCHO_SIZE,
                      data: items.ponchoSize,
                      itemSelected: this.state.characterOutfit[PONCHO_SIZE],
                    });
                  }}
                >
                  Tamanho
                </Button>
                <Button
                  color="rgba(64,64,64)"
                  colorSelected="rgba(29,29,29)"
                  id={HEAD}
                  icon={<MdTagFaces />}
                  selected={this.state.buttonSelected}
                  onClick={(e) => {
                    this.setState({
                      buttonSelected: HEAD,
                      data: items.head,
                      itemSelected: this.state.characterOutfit[HEAD],
                    });
                  }}
                >
                  Cabeça
                </Button>
                <Button
                  color="rgba(64,64,64)"
                  colorSelected="rgba(29,29,29)"
                  id={PONCHO_TEXTURE}
                  icon={
                    <img
                      src={ponchoIcon}
                      style={{ paddingRight: "10px", width: "16px" }}
                    ></img>
                  }
                  selected={this.state.buttonSelected}
                  onClick={(e) => {
                    this.setState({
                      buttonSelected: PONCHO_TEXTURE,
                      data: items.ponchos,
                      itemSelected: this.state.characterOutfit[PONCHO_TEXTURE],
                    });
                  }}
                >
                  Ponchos
                </Button>
                <Button
                  color="rgba(64,64,64)"
                  colorSelected="rgba(29,29,29)"
                  id={BODY_COLOR}
                  icon={<MdAccessibility />}
                  selected={this.state.buttonSelected}
                  onClick={(e) => {
                    this.setState({
                      buttonSelected: BODY_COLOR,
                      data: items.bodyColor,
                      itemSelected: this.state.characterOutfit[BODY_COLOR],
                    });
                  }}
                >
                  Corpo
                </Button>
                <Button
                  color="rgba(64,64,64)"
                  colorSelected="rgba(29,29,29)"
                  id={HEAD_COLOR}
                  icon={<MdColorLens />}
                  selected={this.state.buttonSelected}
                  onClick={(e) => {
                    this.setState({
                      buttonSelected: HEAD_COLOR,
                      data: items.headColor,
                      itemSelected: this.state.characterOutfit[HEAD_COLOR],
                    });
                  }}
                >
                  C. Cabeça
                </Button>
              </div>
              <div className={styles.description}>
                <div>
                  {(this.state.itemSelected === -1
                    ? "Nenhum"
                    : this.state.data[this.state.itemSelected].name) +
                    " selecionado"}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.itensContainer}>
            <ItemList
              data={this.state.data}
              itemSelected={this.state.itemSelected}
              onClick={(e, item) => {
                let outfit = [...this.state.characterOutfit];
                outfit[this.state.buttonSelected] = item.index;
                this.setState({
                  itemSelected: item.index,
                  characterOutfit: outfit,
                });
                console.log(items);
                console.log(outfit);
                window.character.SetOutfit(outfit);
              }}
            ></ItemList>
          </div>
        </div>
      </div>
    ) : null;
  }
}

const mapStateToProps = (state) => {
  return {
    character: state.auth.character,
    loadingUpdate : state.auth.loadingUpdate
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCharacter: (id, data,token) => dispatch(updateCharacter(id, data,token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAvatar);
