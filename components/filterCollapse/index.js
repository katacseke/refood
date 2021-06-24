import { useForm } from 'react-hook-form';
import { Button, Collapse, Container, Form, FormGroup, FormInput, Row, Col } from 'shards-react';

import Checkbox from '../checkbox';

const filterCollapse = ({ open, onSubmit, values }) => {
  const defaultValues = {
    name: values.name || '',
    startTime: values.startTime || '',
    endTime: values.endTime || '',
    donatable: values.donatable === 'true',
    dailyMenu: values.dailyMenu === 'true',
    restaurantId: values.restaurantId || '',
  };
  const { register, handleSubmit, reset } = useForm({ defaultValues });

  const handleClearFilters = () => {
    onSubmit({});
    reset();
  };

  return (
    <Collapse open={open}>
      <div className="p-3 mt-3 border rounded bg-white">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Container>
            <Row>
              <Col>
                <FormGroup>
                  <label htmlFor="name">Név</label>
                  <FormInput
                    innerRef={register}
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Név"
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label htmlFor="startTime">Elérhető ettől</label>
                  <FormInput
                    type="datetime-local"
                    name="startTime"
                    id="startTime"
                    innerRef={register}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <label htmlFor="endTime">Elérhető eddig</label>
                  <FormInput
                    type="datetime-local"
                    name="endTime"
                    id="endTime"
                    innerRef={register}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="d-flex justify-content-between align-items-center">
              <Col>
                <Checkbox name="dailyMenu" innerRef={register}>
                  Napi menü
                </Checkbox>
                <Checkbox name="donatable" innerRef={register}>
                  Adományozható
                </Checkbox>
              </Col>
              <Col className="d-flex justify-content-end">
                <Button theme="secondary" type="button" onClick={handleClearFilters}>
                  Szűrők eltávolítása
                </Button>
                <Button type="submit" className="ml-1">
                  Szűrés
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </div>
    </Collapse>
  );
};

export default filterCollapse;
