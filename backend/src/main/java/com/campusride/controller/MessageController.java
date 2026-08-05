package com.campusride.controller;

import com.campusride.dto.MessageDto;
import com.campusride.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{rideId}")
    public void processMessage(@DestinationVariable Long rideId, @Payload MessageDto messageDto, Principal principal) {
        if (principal == null) return;
        
        // Save to DB
        MessageDto savedMessage = messageService.saveMessage(messageDto, principal.getName());
        
        // Broadcast to specific ride topic
        messagingTemplate.convertAndSend("/topic/ride/" + rideId, savedMessage);
    }

    @GetMapping("/api/v1/messages/{rideId}")
    public ResponseEntity<List<MessageDto>> getMessages(@PathVariable Long rideId) {
        return ResponseEntity.ok(messageService.getMessagesForRide(rideId));
    }
}
