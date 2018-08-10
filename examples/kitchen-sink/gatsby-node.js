const componentWithMDXScope = require("gatsby-mdx/component-with-mdx-scope");
const path = require("path");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allMdx {
              edges {
                node {
                  id
                  tableOfContents
                  fileAbsolutePath
                  codeScope
                  codeBody
                  fileNode {
                    name
                    sourceInstanceName
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // Create blog posts pages.
        result.data.allMdx.edges.forEach(({ node }) => {
          console.log(node.codeScope);
          createPage({
            path: `/${node.fileNode.sourceInstanceName}/${node.fileNode.name}`,
            component: componentWithMDXScope(
              path.resolve("./src/components/mdx-runtime-test.js"),
              node.codeScope,
              __dirname
            ),
            context: {
              absPath: node.absolutePath,
              tableOfContents: node.tableOfContents,
              id: node.id
            }
          });
        });
      })
    );
  });
};