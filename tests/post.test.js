import request from 'supertest';
import { expect } from 'chai';
import app from '../src/server.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

app.listen(3030, () => console.log('Server is running on port 3030...'));

beforeEach(async () => {
  await prisma.post.deleteMany();
});

//CreatePost
describe('POST /posts', () => {
  it('Deve criar uma nova postagem com sucesso', async () => {
    const newPost = {
      title: 'Título do Post',
      description: 'Descrição do post',
      post_type: 'Tipo do Post',
      image_url: 'https://exemplo.com/imagem.jpg',
    };

    const response = await request(app)
      .post('/posts')
      .send(newPost)
      .expect(201);

    expect(response.body).to.have.property('UUID');

    expect(response.body.title).to.equal(newPost.title);
    expect(response.body.description).to.equal(newPost.description);
    expect(response.body.post_type).to.equal(newPost.post_type);
    expect(response.body.image_url).to.equal(newPost.image_url);
  });

  it('Deve retornar erro 400 se os dados enviados forem inválidos', async () => {
    const invalidPost = {
      title: 'Título do Post',
      post_type: 'Tipo do Post',
      image_url: 'https://exemplo.com/imagem.jpg',
    };

    await request(app).post('/posts').send(invalidPost).expect(400);
  });
});

//getAllPosts
describe('GET /posts', () => {
  it('Deve retornar todas as postagens', async () => {
    const post1 = await prisma.post.create({
      data: {
        title: 'Título do Post 1',
        description: 'Descrição do post 1',
        post_type: 'Tipo do Post 1',
        image_url: 'https://exemplo.com/imagem1.jpg',
      },
    });

    const post2 = await prisma.post.create({
      data: {
        title: 'Título do Post 2',
        description: 'Descrição do post 2',
        post_type: 'Tipo do Post 2',
        image_url: 'https://exemplo.com/imagem2.jpg',
      },
    });

    const response = await request(app).get('/posts').expect(200);

    expect(response.body).to.be.an('array');

    expect(
      response.body.some(
        (post) =>
          post.title === post1.title && post.description === post1.description
      )
    ).to.be.true;
    expect(
      response.body.some(
        (post) =>
          post.title === post2.title && post.description === post2.description
      )
    ).to.be.true;
  });
});

//getAllPostsPaginated
describe('GET /posts/paginated', () => {
  it('Deve retornar os posts corretos de acordo com a paginação', async () => {
    const postsIniciais = [
      {
        title: 'Post 1',
        description: 'Descrição do Post 1',
        post_type: 'Tipo do Post 1',
        image_url: 'https://example.com/image1.jpg',
      },
      {
        title: 'Post 2',
        description: 'Descrição do Post 2',
        post_type: 'Tipo do Post 2',
        image_url: 'https://example.com/image2.jpg',
      },
    ];

    await prisma.post.createMany({
      data: postsIniciais,
    });

    const response = await request(app)
      .get('/posts/paginated')
      .query({ page: 1, limit: 2 });

    expect(response.status).to.equal(200);

    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(2);

    await prisma.post.deleteMany();
  });
});

//findPost
describe('GET /posts/:UUID', () => {
  it('Deve retornar o post correto quando fornecido um UUID válido', async () => {
    const postDeTeste = {
      title: 'Título do Post de Teste',
      description: 'Descrição do post de teste',
      post_type: 'Tipo do Post de Teste',
      image_url: 'https://exemplo.com/imagem-teste.jpg',
    };

    const novoPost = await prisma.post.create({ data: postDeTeste });

    const response = await request(app).get(`/posts/${novoPost.UUID}`);

    expect(response.status).to.equal(200);

    const responsePost = { ...response.body };
    const expectedPost = { ...novoPost };

    //Aqui eu tirei as datas porque tava dando erro ao comparar o json delas (tava comparando string com Date:)
    delete responsePost.creation_date;
    delete responsePost.update_date;
    delete expectedPost.creation_date;
    delete expectedPost.update_date;

    expect(responsePost).to.deep.equal(expectedPost);

    await prisma.post.delete({
      where: {
        UUID: novoPost.UUID,
      },
    });
  });

  it('Deve retornar um erro 404 se o post não for encontrado', async () => {
    const UUIDInexistente = 'uuid-inexistente';
    const response = await request(app).get(`/posts/${UUIDInexistente}`);

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('error', 'Post not found');
  });
});

//updatePost
describe('PUT /posts/:UUID', () => {
  it('Deve atualizar uma postagem existente com sucesso', async () => {
    const initialPost = await prisma.post.create({
      data: {
        title: 'Título inicial',
        description: 'Descrição inicial',
        post_type: 'Tipo inicial',
        image_url: 'https://exemplo.com/imagem-inicial.jpg',
      },
    });

    const updatedPostData = {
      title: 'Novo título',
      description: 'Nova descrição',
      post_type: 'Novo tipo',
      image_url: 'https://exemplo.com/nova-imagem.jpg',
    };

    const response = await request(app)
      .put(`/posts/${initialPost.UUID}`)
      .send(updatedPostData)
      .expect(200);

    expect(response.body).to.deep.include(updatedPostData);
  });

  it('Deve retornar um erro 404 se a postagem não for encontrada', async () => {
    const invalidUUID = '12345678-1234-5678-1234-567812345678';

    const response = await request(app)
      .put(`/posts/${invalidUUID}`)
      .send({
        title: 'Título inválido',
        description: 'Descrição inválida',
        post_type: 'Tipo inválido',
        image_url: 'https://exemplo.com/invalid-image.jpg',
      })
      .expect(404);

    expect(response.body).to.have.property('error');
    expect(response.body.error).to.equal('Post not found');
  });
});

//deletePost
describe('DELETE /posts/:UUID', () => {
  it('Deve deletar uma postagem existente com sucesso', async () => {
    const initialPost = await prisma.post.create({
      data: {
        title: 'Título inicial',
        description: 'Descrição inicial',
        post_type: 'Tipo inicial',
        image_url: 'https://exemplo.com/imagem-inicial.jpg',
      },
    });

    const response = await request(app)
      .delete(`/posts/${initialPost.UUID}`)
      .expect(200);

    //criei uma cópia do body da req e da res
    const responsePost = { ...response.body };
    const expectedPost = { ...initialPost.body };

    //Aqui eu tirei as datas porque tava dando erro ao comparar o json delas (tava comparando string com Date:)
    delete responsePost.creation_date;
    delete responsePost.update_date;
    delete expectedPost.creation_date;
    delete expectedPost.update_date;
    expect(responsePost.body).to.deep.equal(expectedPost.body);
  });

  it('Deve retornar um erro 404 se a postagem não for encontrada', async () => {
    const invalidUUID = '12345678-1234-5678-1234-567812345678';

    const response = await request(app)
      .delete(`/posts/${invalidUUID}`)
      .expect(404);

    expect(response.body).to.have.property('error');
    expect(response.body.error).to.equal('Post not found');
  });
});
