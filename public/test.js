$(() => {
  // clear err msg
  $("#errMsg").html("")

  // on csv submit
  $("#submitCsv").on("click", () => {
    // validate fields
    if ($("#providerName").val() === "") {
      return $("#errMsg").html("Provider name should not be blank.")
    }

    const formData = new FormData()
    formData.append("providerName", $("#providerName").val())
    if ($("#vehicles")[0].files[0]) {
      formData.append("vehicles", $("#vehicles")[0].files[0], {
        type: "text/csv"
      })
    } else {
      return $("#errMsg").html("Please upload a CSV.")
    }

    $("#errMsg").html("Submitting request...")

    $.ajax({
      type: "POST",
      url: `/vehicles`,
      data: formData,
      enctype: "multipart/form-data",
      processData: false,
      contentType: false,
      cache: false,
      success(resp) {
        $("#errMsg").html("Submission successful and is now processing...")
      },
      error(resp) {
        $("#errMsg").html(JSON.stringify(resp))
      }
    })
  })

  // on refresh
  $("#refreshVehicles").on("click", () => {
    $.ajax({
      type: "GET",
      url: `/vehicles`,
      contentType: "application/json",
      dataType: "json",
      complete(resp) {
        if (resp.status === 200) {
          const jsonResp = resp.responseJSON
          const vehicles = []
          if (jsonResp) {
            jsonResp.forEach(j => {
              vehicles.push(`<div>${JSON.stringify(j)}</div>`)
            })
          }
          $("#currentVehicles").html(vehicles.join())
        } else {
          $("#errMsg").html(
            `<div>Refresh Error: ${resp.responseJSON.message ||
              resp.responseJSON}</div>`
          )
        }
      }
    })
  })
})
